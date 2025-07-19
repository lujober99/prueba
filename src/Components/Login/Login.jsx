// src/pages/Login.jsx
import { useState, useEffect } from "react"; // ✅ agrega useEffect aquí
import { useNavigate, Link } from "react-router-dom";
import Swal from "sweetalert2";
import { useAuth } from "../AuthContext/AuthContext.jsx";
import "./Login.css";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // ✅ redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      login(data.accessToken, data);
      navigate("/home");
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Usuario o contraseña incorrectos",
        confirmButtonColor: "#d33",
        background: "#fff8f5",
      });
    }
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Iniciar sesión</h2>
      <form className="login-form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="Usuario"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="login-input"
        />
        <input
          type="password"
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="login-input"
        />
        <button type="submit" className="login-button">Ingresar</button>
        <p className="login-link">
          ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
