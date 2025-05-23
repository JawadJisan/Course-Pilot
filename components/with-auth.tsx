// hoc/with-auth.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { LoadingSpinner } from "./loading-spinner";

export const withAuth = (Component: React.ComponentType) => {
  return function ProtectedRoute(props: any) {
    const router = useRouter();
    const { user } = useAuthStore();
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
      const timer = setTimeout(() => {
        if (!user) {
          router.push("/sign-in");
        }
        setIsLoading(false);
      }, 300);

      return () => clearTimeout(timer);
    }, [user, router]);

    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-screen">
          <LoadingSpinner />
        </div>
      );
    }

    return user ? <Component {...props} /> : null;
  };
};
