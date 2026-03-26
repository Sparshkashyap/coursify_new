import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Loader2 } from "lucide-react";

interface PrivateRouteProps {
  allowedRoles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ allowedRoles }) => {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-5 w-5 animate-spin" />
          Loading...
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (
    allowedRoles &&
    allowedRoles.length > 0 &&
    (!user?.role || !allowedRoles.includes(user.role))
  ) {
    if (user?.role === "admin") {
      return <Navigate to="/admin" replace />;
    }

    if (user?.role === "instructor") {
      return <Navigate to="/instructor" replace />;
    }

    return <Navigate to="/student" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;