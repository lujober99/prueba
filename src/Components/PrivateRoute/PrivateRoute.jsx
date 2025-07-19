import { Navigate } from 'react-router-dom';
import { useAuth } from "../AuthContext/AuthContext.jsx"; // Importa el hook useAuth

const PrivateRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) return null; // aún no sabe si está logueado
  return isAuthenticated ? children : <Navigate to="/" />;
};

export default PrivateRoute;
