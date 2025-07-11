import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./user.css";
import { LogOut } from 'lucide-react';
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
    <div className="user-info-panel">
      <div className="user-info">
        <p className="username">{user.username}</p>
        <p className="email">{user.email}</p>
      </div>
      <button className="logout-button" onClick={handleLogout}>
        <LogOut size={18} />
      </button>
    </div>
  );
};

export default User;
