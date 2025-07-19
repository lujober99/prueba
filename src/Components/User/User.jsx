// src/components/User.jsx
import { useAuth } from "../AuthContext/AuthContext.jsx"; // Importa el hook useAuth
import { useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import "./user.css";

const User = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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
