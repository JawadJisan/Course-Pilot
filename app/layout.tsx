import "./globals.css";
import { Inter } from "next/font/google";
import type React from "react";
import type { Metadata } from "next";
import MouseMoveEffect from "@/components/mouse-move-effect";
import { AuthProvider } from "@/components/auth-provider";
import { Toaster } from "sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CoursePilot",
  description: "Chart your learning path. Master your skills.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${inter.className} bg-background text-foreground antialiased`}
      >
        <AuthProvider>
          <MouseMoveEffect />
          {children}
          <Toaster expand={true} richColors />
        </AuthProvider>
      </body>
    </html>
  );
}
