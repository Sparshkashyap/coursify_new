import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  GraduationCap,
  User,
  LogOut,
  ShieldCheck,
  UserCircle2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import defaultAvatar from "@/assets/avtar.jpg";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { label: "Home", to: "/", animatedLine: true },
  { label: "Courses", to: "/courses", animatedLine: true },
  { label: "About", to: "/about", animatedLine: true },
];

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, isAuthenticated, logout, loading } = useAuth();
  const location = useLocation();

  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "instructor") return "/instructor";
    return "/student";
  };

  const handleScrollTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const isActiveLink = (to: string) => {
    if (to === "/") return location.pathname === "/";
    return location.pathname.startsWith(to);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-border/70 bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          onClick={handleScrollTop}
          className="group flex shrink-0 items-center gap-2.5"
        >
          <div className="rounded-xl border border-primary/15 bg-primary/10 p-2 transition-transform duration-200 group-hover:scale-[1.03]">
            <GraduationCap className="h-5 w-5 text-primary sm:h-6 sm:w-6" />
          </div>

          <div className="flex flex-col leading-none">
            <span className="font-display text-lg font-bold tracking-tight text-foreground sm:text-xl">
              Coursify
            </span>
            <span className="hidden text-[11px] font-medium text-muted-foreground sm:block">
              Learn without limits
            </span>
          </div>
        </Link>

        <nav className="hidden items-center rounded-full border border-border/70 bg-card/70 px-2 py-1 md:flex">
          {navLinks.map((link) => {
            const isActive = isActiveLink(link.to);

            return (
              <Link
                key={link.to}
                to={link.to}
                onClick={handleScrollTop}
                className={`group relative inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <span className="relative z-10">{link.label}</span>

                {link.animatedLine && (
                  <span
                    className={`absolute bottom-1.5 left-4 h-[2px] rounded-full bg-primary transition-all duration-300 ease-out ${
                      isActive
                        ? "w-[calc(100%-2rem)]"
                        : "w-0 group-hover:w-[calc(100%-2rem)]"
                    }`}
                  />
                )}

                {!link.animatedLine && (
                  <span
                    className={`absolute inset-0 rounded-full transition-colors ${
                      isActive ? "bg-primary/10" : "group-hover:bg-muted"
                    }`}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full border border-transparent transition hover:border-border hover:bg-muted"
            aria-label="Toggle theme"
          >
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {loading ? null : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-10 w-10 rounded-full border border-transparent transition hover:border-border hover:bg-muted"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.avatar || defaultAvatar} />
                    <AvatarFallback>
                      {user?.name?.charAt(0) || "U"}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                align="end"
                className="w-60 rounded-2xl border border-border/70 bg-card p-1 shadow-xl"
              >
                <div className="px-3 py-2.5">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="mt-1 text-xs font-medium capitalize text-primary">
                    {user?.role}
                  </p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="rounded-xl">
                  <Link
                    to={getDashboardLink()}
                    onClick={handleScrollTop}
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Dashboard
                  </Link>
                </DropdownMenuItem>

                {user?.role === "admin" && (
                  <DropdownMenuItem asChild className="rounded-xl">
                    <Link
                      to="/admin"
                      onClick={handleScrollTop}
                      className="flex items-center gap-2"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Admin Panel
                    </Link>
                  </DropdownMenuItem>
                )}

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild className="rounded-xl">
                  <Link
                    to="/profile"
                    onClick={handleScrollTop}
                    className="flex items-center gap-2"
                  >
                    <UserCircle2 className="h-4 w-4" />
                    Edit Profile
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={logout}
                  className="rounded-xl text-red-500 focus:text-red-500"
                >
                  <div className="flex items-center gap-2">
                    <LogOut className="h-4 w-4" />
                    Logout
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button
                variant="ghost"
                size="sm"
                asChild
                className="rounded-full px-4"
              >
                <Link to="/login" onClick={handleScrollTop}>
                  Login
                </Link>
              </Button>

              <Button size="sm" asChild className="rounded-full px-4 shadow-sm">
                <Link to="/signup" onClick={handleScrollTop}>
                  Sign up
                </Link>
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
