import { Navigate } from 'react-router-dom';
import { useAuth } from "../AuthContext/AuthContext"; // Importa el hook useAuth
import { ReactNode } from 'react';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return null; // aún no sabe si está logueado
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
