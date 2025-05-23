"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  BookOpen,
  GraduationCap,
  LayoutDashboard,
  MessageSquare,
  User,
  Menu,
  X,
  LogOut,
  Settings,
  BookMarked,
  Bell,
  ChevronDown,
} from "lucide-react";
import { useState } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const router = useRouter();

  const isAuthenticated = !!user;

  // Generate initials from user name
  const getInitials = (name: string) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-screen-2xl items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-xl bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
              CoursePilot
            </span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium ml-6">
            <Link
              href="/courses/all-courses"
              className="flex items-center gap-1.5 transition-colors hover:text-primary"
            >
              <BookOpen className="h-4 w-4" />
              <span>Courses</span>
            </Link>
            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/interview"
                  className="flex items-center gap-1.5 transition-colors hover:text-primary"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span>Interviews</span>
                </Link>
              </>
            )}
          </nav>
        </div>

        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <div className="flex items-center gap-3">
              {/* User dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className="p-1 flex items-center gap-2 hover:bg-muted"
                  >
                    <Avatar className="h-8 w-8">
                      <AvatarImage
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                        alt={user?.name || "User"}
                      />
                      <AvatarFallback>
                        {getInitials(user?.name || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start text-left">
                      <span className="text-sm font-medium">{user?.name}</span>
                      <span className="text-xs text-muted-foreground truncate max-w-[120px]">
                        {user?.email}
                      </span>
                    </div>
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-56 mt-5 bg-transparent"
                  align="end"
                >
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuGroup>
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard" className="cursor-pointer">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        <span>Dashboard</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/courses/my-courses"
                        className="cursor-pointer"
                      >
                        <BookMarked className="mr-2 h-4 w-4" />
                        <span>My Courses</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings" className="cursor-pointer">
                        <Settings className="mr-2 h-4 w-4" />
                        <span>Settings</span>
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-500 focus:text-red-500"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <>
              <Link href="/sign-in">
                <Button variant="ghost" size="sm">
                  Login
                </Button>
              </Link>
              <Link href="/sign-up">
                <Button size="sm">Sign Up</Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden">
          {isAuthenticated ? (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </Button>
            </div>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </Button>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background">
          <div className="container py-4 space-y-4">
            {isAuthenticated && (
              <div className="flex items-center gap-3 p-2">
                <Avatar className="h-10 w-10">
                  <AvatarImage
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`}
                    alt={user?.name || "User"}
                  />
                  <AvatarFallback>
                    {getInitials(user?.name || "")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="font-medium">{user?.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {user?.email}
                  </span>
                </div>
              </div>
            )}

            <Link
              href="/courses/all-courses"
              className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              <BookOpen className="h-5 w-5" />
              <span>Courses</span>
            </Link>

            {isAuthenticated && (
              <>
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <LayoutDashboard className="h-5 w-5" />
                  <span>Dashboard</span>
                </Link>
                <Link
                  href="/interview"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <MessageSquare className="h-5 w-5" />
                  <span>Interviews</span>
                </Link>
                <Link
                  href="/profile"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <User className="h-5 w-5" />
                  <span>Profile</span>
                </Link>
                <Link
                  href="/courses/my-courses"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <BookMarked className="h-5 w-5" />
                  <span>My Courses</span>
                </Link>
                <Link
                  href="/settings"
                  className="flex items-center gap-2 p-2 rounded-md hover:bg-muted"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <Settings className="h-5 w-5" />
                  <span>Settings</span>
                </Link>

                <div className="pt-2 border-t border-border/40">
                  <Button
                    className="w-full flex items-center justify-center gap-2"
                    size="sm"
                    variant="destructive"
                    onClick={handleLogout}
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </Button>
                </div>
              </>
            )}

            {!isAuthenticated && (
              <div className="pt-2 border-t border-border/40 flex flex-col gap-2">
                <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/sign-up" onClick={() => setMobileMenuOpen(false)}>
                  <Button className="w-full" size="sm">
                    Sign Up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
