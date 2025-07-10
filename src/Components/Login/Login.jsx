import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import Swal from 'sweetalert2';

const Login = ({ setIsAuthenticated }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();




  const handleLogin = async (e) => {
    e.preventDefault();

    const res = await fetch("https://dummyjson.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();

    if (res.ok) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      window.dispatchEvent(new Event("storage")); 
      setIsAuthenticated(true);
      navigate("/home");
    } else Swal.fire({
        icon: 'error',
        title: 'Oops...',
        text: 'Usuario o contraseña incorrectos',
        confirmButtonColor: '#d33',
        background: '#fff8f5',
      });
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
        <button type="submit" className="login-button">
          Ingresar
        </button>
        <p className="login-link">
  ¿No tienes cuenta? <Link to="/register">Regístrate aquí</Link>
</p>
      </form>
    </div>
  );
};

export default Login;
