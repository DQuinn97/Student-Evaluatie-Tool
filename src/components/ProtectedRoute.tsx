import { ReactNode, useEffect, useState } from "react";
import { Navigate } from "react-router";
import api from "../api";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole?: "student" | "docent";
}

export const ProtectedRoute = ({
  children,
  allowedRole,
}: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState<"student" | "docent" | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: user } = await api.get("/profiel");
        setIsAuthenticated(true);
        setUserRole(user.isDocent ? "docent" : "student");
      } catch (error) {
        setIsAuthenticated(false);
        toast.error("Je moet ingelogd zijn om deze pagina te bekijken");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && userRole !== allowedRole) {
    const redirectPath =
      userRole === "docent" ? "/docent/dashboard" : "/student/dashboard";
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};
