// app/(protected)/layout.tsx
"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { toast } from "sonner";
import { LoadingSpinner } from "@/components/loading-spinner";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuthStore();
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!user) {
        toast.error("Please login to access this section");
        router.push("/sign-in");
      }
      setIsChecking(false);
    }, 300); // Short delay for store hydration

    return () => clearTimeout(timer);
  }, [user, router]);

  if (isChecking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return user ? <>{children}</> : null;
}
