import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function RequireStudent({ children }) {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (user.role !== "student") return <Navigate to="/admin" replace />;

  return children;
}
