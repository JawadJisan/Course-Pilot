"use client";

import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

interface LoadingSpinnerProps {
  /**
   * Optional additional className
   */
  className?: string;
}

export function LoadingSpinner({ className }: LoadingSpinnerProps = {}) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div
      className={cn(
        "fixed inset-0 flex items-center justify-center z-50",
        className
      )}
    >
      <div className="relative">
        {/* Main spinner */}
        <div className="h-16 w-16 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>

        {/* Inner glow */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-8 w-8 rounded-full bg-primary/10 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}
