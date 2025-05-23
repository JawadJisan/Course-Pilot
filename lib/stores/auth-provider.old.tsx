// components/auth-provider.tsx
"use client";
import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { auth } from "@/firebase/client";
import { toast } from "sonner";

let refreshDebounce: NodeJS.Timeout;
const REFRESH_WINDOW = 60 * 60 * 1000; // 1 hour before expiration

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshSession, logout, fetchUser } = useAuthStore();

  // Sync Firebase auth state with backend
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          await fetchUser();
        } catch (error) {
          // toast.error("Session validation failed");
          await logout();
        }
      } else {
        await logout();
      }
    });
    return () => unsubscribe();
  }, []);

  // Activity-based session refresh
  useEffect(() => {
    const handleActivity = () => {
      if (
        user &&
        Date.now() > new Date(user.expiresAt).getTime() - REFRESH_WINDOW
      ) {
        clearTimeout(refreshDebounce);
        refreshDebounce = setTimeout(() => {
          refreshSession().catch(() => {
            // toast.error("Failed to refresh session");
          });
        }, 1000);
      }
    };

    const events = ["mousemove", "keydown", "scroll", "touchstart"];
    events.forEach((event) => window.addEventListener(event, handleActivity));
    return () =>
      events.forEach((event) =>
        window.removeEventListener(event, handleActivity)
      );
  }, [user]);

  return <>{children}</>;
}
