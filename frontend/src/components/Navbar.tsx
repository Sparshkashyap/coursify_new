import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Sun,
  Moon,
  GraduationCap,
  User,
  LogOut,
  ShieldCheck,
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
  { label: "Home", to: "/" },
  { label: "Courses", to: "/courses" },
  { label: "About", to: "/about" },
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

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between gap-4">
        <Link
          to="/"
          onClick={handleScrollTop}
          className="flex items-center gap-2 font-display text-xl font-bold text-primary"
        >
          <GraduationCap className="h-7 w-7" />
          Coursify
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={handleScrollTop}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-colors hover:bg-muted ${
                location.pathname === link.to
                  ? "text-primary"
                  : "text-muted-foreground"
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={toggleTheme}>
            {theme === "light" ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </Button>

          {loading ? null : isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
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
                className="w-56 rounded-xl border-border bg-card"
              >
                <div className="px-3 py-2">
                  <p className="truncate text-sm font-semibold text-foreground">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {user?.email}
                  </p>
                  <p className="mt-1 text-xs capitalize text-primary">
                    {user?.role}
                  </p>
                </div>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
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
                  <DropdownMenuItem asChild>
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

                <DropdownMenuItem
                  onClick={logout}
                  className="flex items-center gap-2 text-red-500 focus:text-red-500"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden items-center gap-2 sm:flex">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login" onClick={handleScrollTop}>
                  Login
                </Link>
              </Button>

              <Button size="sm" asChild>
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