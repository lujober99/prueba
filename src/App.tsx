import { HashRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Components/Login/Login';
import Header from './Components/Header/Header';
import PokemonDescription from './Components/Description/Description';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute';
import Register from './Components/Register/Register';
import PokemonList from './Components/PokemosList/PokemonList';
import { useAuth } from './Components/AuthContext/AuthContext';

const App: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (isAuthenticated === null) {
    return null; // evita render hasta saber si hay auth
  }

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/home"
          element={
            <PrivateRoute>
              <>
                <PokemonList />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/pokemon/:id"
          element={
            <PrivateRoute >
              <PokemonDescription />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default App;
