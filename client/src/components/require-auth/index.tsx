import { useContext } from "react";
import { useLocation, Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "@/context/AuthContext";
import { ProgressSpinner } from "primereact/progressspinner";

export function RequireAuth() {
  const { authenticated, isLoading } = useContext(AuthContext);
  const location = useLocation();

  if (isLoading) {
    return (
        <div className="flex justify-content-center align-items-center h-screen">
            <ProgressSpinner />
        </div>
    );
  }

  return authenticated ? (
    <Outlet />
  ) : (
    <Navigate to="/login" state={{ from: location }} replace />
  );
}