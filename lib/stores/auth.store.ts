// lib/stores/auth.store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { auth } from "@/firebase/client";
import axios from "axios";
import { toast } from "sonner";
import { signInWithEmailAndPassword } from "firebase/auth";

interface AuthState {
  user: {
    uid: string;
    email: string;
    name: string;
    expiresAt: string;
  } | null;
  logoutTimer: NodeJS.Timeout | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  scheduleLogout: (expiresAt: Date) => void;
  fetchUser: () => Promise<void>;
}

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// axios interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Skip handling for login/refresh endpoints
    if (
      originalRequest.url.includes("/auth/login") ||
      originalRequest.url.includes("/auth/refresh")
    ) {
      return Promise.reject(error);
    }

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const authStore = useAuthStore.getState();

      try {
        if (authStore.user) {
          await authStore.refreshSession();
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Refresh failed:", refreshError);
        await authStore.logout();
        window.location.href = "/sign-in";
      }
    }

    return Promise.reject(error);
  }
);

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      logoutTimer: null,
      login: async (email, password) => {
        try {
          // 1. Firebase authentication
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          // 2. Get fresh ID token
          const idToken = await userCredential.user.getIdToken();
          // 3. Backend session creation
          const { data } = await api.post("/auth/login", { idToken });
          // 4. Update local state with initial data
          set({ user: data.data });
          // 5. Schedule session termination
          get().scheduleLogout(new Date(data.data.expiresAt));
          // 6. Wait for cookie propagation before fetching user details
          await new Promise((resolve) => setTimeout(resolve, 300));
          await get().fetchUser();
        } catch (error) {
          let errorMessage = "Login failed. Please check your credentials.";
          if (axios.isAxiosError(error)) {
            errorMessage = error.response?.data?.message || errorMessage;
          } else if (error instanceof Error) {
            errorMessage = error.message;
          }
          throw new Error(errorMessage);
        }
      },
      // auth.store.ts
      register: async (name, email, password) => {
        try {
          const { data } = await api.post("/auth/signup", {
            name,
            email,
            password,
          });
          // Optional: Auto-login after registration
          // await get().login(email, password);
          return data;
        } catch (error) {
          if (axios.isAxiosError(error)) {
            throw new Error(
              error.response?.data?.error || "Registration failed"
            );
          }
          throw new Error("Registration failed");
        }
      },
      logout: async () => {
        try {
          // Only call backend if session exists
          if (get().user) {
            await api.post("/auth/logout");
          }
          await auth.signOut();
          // Clear all local state
          set({ user: null });
          if (get().logoutTimer) clearTimeout(get().logoutTimer!);
        } catch (error) {
          console.error("Logout error:", error);
        }
      },
      refreshSession: async () => {
        try {
          // Force token refresh
          await auth.currentUser?.getIdToken(true);
          const idToken = await auth.currentUser?.getIdToken();

          if (!idToken || !auth.currentUser) {
            throw new Error("Not authenticated");
          }

          // Refresh backend session
          const { data: refreshData } = await api.post("/auth/refresh", {
            idToken,
          });

          // Update expiration timing
          set((state) => ({
            user: state.user
              ? {
                  ...state.user,
                  expiresAt: refreshData.data.expiresAt,
                }
              : null,
          }));

          get().scheduleLogout(new Date(refreshData.data.expiresAt));
        } catch (error) {
          console.error("Session refresh failed:", error);
          if (get().user) {
            await get().logout();
          }
        }
      },
      fetchUser: async () => {
        try {
          // Only fetch if we expect valid session
          if (!get().user) return;
          const { data } = await api.get("/auth/me");
          set({ user: data.data });
        } catch (error) {
          // Handle 401 only if we expected valid session
          if (
            axios.isAxiosError(error) &&
            error.response?.status === 401 &&
            get().user
          ) {
            await get().logout();
          }
        }
      },
      scheduleLogout: (expiresAt) => {
        const timeUntilExpiration = expiresAt.getTime() - Date.now() - 30000;
        if (timeUntilExpiration > 0) {
          if (get().logoutTimer) clearTimeout(get().logoutTimer!);
          set({
            logoutTimer: setTimeout(() => {
              get()
                .logout()
                .catch(() => {
                  toast.error("Failed to automatically logout");
                });
            }, timeUntilExpiration),
          });
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({ user: state.user }),
    }
  )
);
