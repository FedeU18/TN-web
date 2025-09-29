import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/auth";

export const ProtectedRoute = ({ children, roles }) => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  //si no hay token => redirigir al login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  //si hay roles definidos y el usuario no pertenece => redirigir
  if (roles && !roles.includes(user?.rol)) {
    return <Navigate to="/" replace />;
  }

  return children;
};