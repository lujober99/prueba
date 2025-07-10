import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";

const User = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate(); 

  const syncUser = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (!token || !storedUser) {
      setUser(null);
    } else {
      setUser(JSON.parse(storedUser));
    }
  };

  useEffect(() => {
    syncUser();

    // Suscribirse a cambios de localStorage (evento personalizado)
    window.addEventListener("storage", syncUser);

    return () => {
      window.removeEventListener("storage", syncUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/");
  };

  if (!user) return null;

  return (
    <div className="user-card">
      <h3>{user.firstName} {user.lastName}</h3>
      <p><strong>Usuario:</strong> {user.username}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Género:</strong> {user.gender}</p>
      <button className="logout-button" onClick={handleLogout}>Cerrar sesión</button>
    </div>
  );
};

export default User;
