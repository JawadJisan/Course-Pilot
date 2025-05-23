// components/auth-provider.tsx
"use client";
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { auth } from "@/firebase/client";
import { toast } from "sonner";

let refreshDebounce: NodeJS.Timeout;
const REFRESH_WINDOW = 60 * 60 * 1000;

// components/auth-provider.tsx
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, refreshSession, logout, fetchUser } = useAuthStore();
  const authCheckInProgress = useRef(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (authCheckInProgress.current) return;
      authCheckInProgress.current = true;

      try {
        if (firebaseUser) {
          // Wait for potential cookie synchronization
          await new Promise((resolve) => setTimeout(resolve, 500));

          // Validate session only if no existing user state
          if (!user) await fetchUser();
        } else {
          // Clear state only if we expected a session
          if (user) await logout();
        }
      } catch (error) {
        console.error("Auth state error:", error);
        if (user) await logout();
      } finally {
        authCheckInProgress.current = false;
      }
    });

    return () => unsubscribe();
  }, [user]);

  // Activity-based refresh logic
  useEffect(() => {
    const handleActivity = () => {
      if (!user) return;

      const expirationTime = new Date(user.expiresAt).getTime();
      const timeUntilExpiration = expirationTime - Date.now();

      if (timeUntilExpiration < REFRESH_WINDOW) {
        clearTimeout(refreshDebounce);
        refreshDebounce = setTimeout(() => {
          refreshSession().catch(() => {
            toast.error("Session refresh failed");
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

  // Automatic session termination
  useEffect(() => {
    if (!user) return;

    const checkExpiration = setInterval(() => {
      const remainingTime = new Date(user.expiresAt).getTime() - Date.now();

      if (remainingTime <= 300000) {
        // 5 minutes
        toast.warning("Session expiring soon...");
      }

      if (remainingTime <= 0) {
        logout().catch(() => {
          toast.error("Automatic logout failed");
        });
      }
    }, 60000); // Check every minute

    return () => clearInterval(checkExpiration);
  }, [user]);

  return <>{children}</>;
}
