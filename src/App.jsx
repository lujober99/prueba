import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './Components/Login/Login.jsx';
import Header from './Components/Header/Header.jsx';
import PokemonGallery from './Components/Pokemones/PokemonGallery.jsx';
import PokemonDescription from './Components/Description/Description.jsx';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute.jsx';
import Register from './Components/Register/Register.jsx';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un token en localStorage para mantener sesión activa
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token);
  }, []);

  return (
    <Router>
      <p>{isAuthenticated ? "si" : "no"}</p>
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

              <PokemonGallery />
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
