import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Components/Login/Login.jsx';
import Header from './Components/Header/Header.jsx';
import PokemonGallery from './Components/Pokemones/PokemonGallery.jsx';
import PokemonDescription from './Components/Description/Description.jsx';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute.jsx';
import Register from './Components/Register/Register.jsx';
import PokemonList from './Components/PokemosList/PokemonList.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  if (isAuthenticated === null) {
    return null; // evita render hasta saber si hay auth
  }

  return (
    <Router>
      {isAuthenticated && <Header />}
      <Routes>
        <Route
          path="/"
          element={<Login setIsAuthenticated={setIsAuthenticated} />}
        />
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/home"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <>
                <PokemonList />
                <PokemonGallery />
              </>
            </PrivateRoute>
          }
        />
        <Route
          path="/pokemon/:id"
          element={
            <PrivateRoute isAuthenticated={isAuthenticated}>
              <PokemonDescription />
            </PrivateRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;
