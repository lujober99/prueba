import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ isAuthenticated, children }) => {
  if (isAuthenticated === null) {
    return null; // o un spinner si prefieres
  }

  return isAuthenticated ? children : <Navigate to="/" replace />;
};

export default PrivateRoute;
