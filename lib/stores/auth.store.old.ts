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
  logout: () => Promise<void>;
  refreshSession: () => Promise<void>;
  scheduleLogout: (expiresAt: Date) => void;
  fetchUser: () => Promise<void>;
}

// Configure axios instance
const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const authStore = useAuthStore.getState();
      toast.error("Session expired. Please login again.");
      await authStore.logout();
      window.location.href = "/sign-in";
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
          const userCredential = await signInWithEmailAndPassword(
            auth,
            email,
            password
          );
          const idToken = await userCredential.user.getIdToken();

          const { data } = await api.post("/auth/login", { idToken });
          console.log("login data:", data);

          set({ user: data.data });
          get().scheduleLogout(new Date(data.data.expiresAt));
          toast.success("Login successful");
        } catch (error) {
          console.log("error:", error);
          toast.error("Login failed. Please check your credentials.");
        }
      },
      logout: async () => {
        try {
          await auth.signOut();
          // await api.post("/auth/logout");
          set({ user: null });
          if (get().logoutTimer) clearTimeout(get().logoutTimer!);
          toast.success("Logged out successfully");
        } catch (error) {
          // toast.error("Logout failed. Please try again.");
          throw error;
        }
      },
      refreshSession: async () => {
        try {
          await auth.currentUser?.getIdToken(true);
          const idToken = await auth.currentUser?.getIdToken();
          if (!idToken || !auth.currentUser)
            throw new Error("Not authenticated");

          const { data: refreshData } = await api.post("/auth/refresh", {
            idToken,
          });
          console.log("refreshData:", refreshData);
          const { data: userData } = await api.get("/auth/me");
          console.log("userData:", userData);
          set({
            user: {
              ...userData.data,
              expiresAt: refreshData.data.expiresAt,
            },
          });
          get().scheduleLogout(new Date(refreshData.data.expiresAt));
        } catch (error) {
          // toast.error("Session refresh failed. Please login again.");
          await get().logout();
          throw error;
        }
      },
      fetchUser: async () => {
        try {
          const { data } = await api.get("/auth/me");
          console.log("userData fetchUser:", data);
          set({ user: data.data });
        } catch (error) {
          await get().logout();
          throw error;
        }
      },
      scheduleLogout: (expiresAt) => {
        const timeUntilExpiration = expiresAt.getTime() - Date.now() - 30000;
        if (timeUntilExpiration > 0) {
          if (get().logoutTimer) clearTimeout(get().logoutTimer!);
          set({
            logoutTimer: setTimeout(() => {
              // toast.info("Your session has expired. Please login again.");
              get().logout();
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
