import React from "react";
import { Outlet, Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavLink } from "@/components/NavLink";
import {
  LayoutDashboard,
  BookOpen,
  Award,
  Heart,
  Sparkles,
  DollarSign,
  Users,
  BarChart3,
  CreditCard,
  Settings,
  GraduationCap,
  LogOut,
  Sun,
  Moon,
  ChevronRight,
  UserCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/contexts/ThemeContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { motion } from "framer-motion";

const studentLinks = [
  { title: "Overview", url: "/student", icon: LayoutDashboard },
  { title: "My Courses", url: "/student/courses", icon: BookOpen },
  { title: "Certificates", url: "/student/certificates", icon: Award },
  { title: "Wishlist", url: "/student/wishlist", icon: Heart },
  { title: "AI Recommendation", url: "/student/ai-recommendation", icon: Sparkles },
  { title: "Profile", url: "/profile", icon: UserCircle2 },
];

const instructorLinks = [
  { title: "Overview", url: "/instructor", icon: LayoutDashboard },
  { title: "My Courses", url: "/instructor/courses", icon: BookOpen },
  { title: "Earnings", url: "/instructor/earnings", icon: DollarSign },
  { title: "AI Generator", url: "/instructor/ai-generator", icon: Sparkles },
  { title: "Affiliates", url: "/instructor/affiliates", icon: Users },
  { title: "Profile", url: "/profile", icon: UserCircle2 },
  
];

const adminLinks = [
  { title: "Analytics", url: "/admin", icon: BarChart3 },
  { title: "Users", url: "/admin/users", icon: Users },
  { title: "Courses", url: "/admin/courses", icon: BookOpen },
  { title: "Payments", url: "/admin/payments", icon: CreditCard },
  { title: "Settings", url: "/admin/settings", icon: Settings },
  { title: "Profile", url: "/profile", icon: UserCircle2 },
];

function DashboardSidebar() {
  const { user, logout } = useAuth();
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const { theme, toggleTheme } = useTheme();

  const links =
    user?.role === "admin"
      ? adminLinks
      : user?.role === "instructor"
      ? instructorLinks
      : studentLinks;

  const roleLabel =
    user?.role === "admin"
      ? "Admin"
      : user?.role === "instructor"
      ? "Instructor"
      : "Student";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border bg-sidebar text-sidebar-foreground"
    >
      <SidebarContent className="flex flex-col justify-between bg-sidebar">
        <div>
          <div className="border-b border-sidebar-border px-4 py-4">
            <Link
              to="/"
              className="flex items-center gap-3 font-display text-lg font-bold text-sidebar-foreground"
            >
              <div className="rounded-xl bg-sidebar-primary/15 p-2">
                <GraduationCap className="h-5 w-5 shrink-0 text-sidebar-primary" />
              </div>
              {!collapsed && <span>Coursify</span>}
            </Link>
          </div>

          {!collapsed && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border-b border-sidebar-border px-4 py-4"
            >
              <div className="flex items-center gap-3 rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/40 p-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.charAt(0) || "U"}</AvatarFallback>
                </Avatar>

                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-sidebar-foreground">
                    {user?.name || "User"}
                  </p>
                  <p className="text-xs capitalize text-muted-foreground">
                    {roleLabel}
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <SidebarGroup className="px-2 py-4">
            <SidebarGroupLabel className="px-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              {roleLabel} Panel
            </SidebarGroupLabel>

            <SidebarGroupContent>
              <SidebarMenu className="space-y-1">
                {links.map((item, index) => (
                  <motion.div
                    key={item.title}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.04 }}
                  >
                    <SidebarMenuItem>
                      <SidebarMenuButton asChild>
                        <NavLink
                          to={item.url}
                          end={
                            item.url === "/student" ||
                            item.url === "/instructor" ||
                            item.url === "/admin"
                          }
                          className="group flex items-center rounded-xl px-3 py-2.5 text-sm transition hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                          activeClassName="bg-sidebar-primary/15 text-sidebar-primary font-medium shadow-sm"
                        >
                          <item.icon className="mr-2 h-4 w-4 shrink-0" />
                          {!collapsed && (
                            <>
                              <span className="flex-1">{item.title}</span>
                              <ChevronRight className="h-4 w-4 opacity-0 transition group-hover:opacity-100" />
                            </>
                          )}
                        </NavLink>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  </motion.div>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </div>

        <div className="border-t border-sidebar-border p-3">
          <div className="space-y-1">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 rounded-xl text-sidebar-foreground hover:bg-sidebar-accent"
              onClick={toggleTheme}
            >
              {theme === "light" ? (
                <Moon className="h-4 w-4" />
              ) : (
                <Sun className="h-4 w-4" />
              )}
              {!collapsed && <span>Toggle theme</span>}
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start gap-2 rounded-xl text-destructive hover:bg-destructive/10 hover:text-destructive"
              onClick={logout}
            >
              <LogOut className="h-4 w-4" />
              {!collapsed && <span>Log out</span>}
            </Button>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}

const DashboardLayout: React.FC = () => {
  return (
    <SidebarProvider defaultOpen>
      <div className="flex min-h-screen w-full bg-background text-foreground">
        <DashboardSidebar />

        <div className="flex min-w-0 flex-1 flex-col bg-background">
          <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background px-4">
            <div className="flex items-center gap-3">
              <SidebarTrigger />
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">Dashboard Workspace</p>
                <p className="text-xs text-muted-foreground">
                  Manage your learning and content with a cleaner workflow
                </p>
              </div>
            </div>
          </header>

          <main className="flex-1 p-4 md:p-6">
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mx-auto w-full max-w-7xl"
            >
              <Outlet />
            </motion.div>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
};

export default DashboardLayout;