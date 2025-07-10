import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";
import Swal from "sweetalert2";
const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
    firstName: "",
    lastName: "",
    gender: "male",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const res = await fetch("https://dummyjson.com/users/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await res.json();

    if (res.ok) {
      // Simula token ya que dummyjson no devuelve uno al registrar
      const fakeToken = "dummy_token_" + Date.now();

      // Guarda el usuario y el token
      localStorage.setItem("token", fakeToken);
      localStorage.setItem("user", JSON.stringify(data));
      


      Swal.fire({
        icon: "success",
        title: "¡Registro exitoso!",
        text: "Ahora puedes iniciar sesión",
        confirmButtonText: "Ir al login",
        confirmButtonColor: "#3085d6",
      }).then(() => {
        navigate("/");
      });
    } else {
      alert("Error al registrarse");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-title">Registro</h2>
      <form className="register-form" onSubmit={handleRegister}>
        <input
          name="firstName"
          placeholder="Nombre"
          value={formData.firstName}
          onChange={handleChange}
          className="register-input"
        />
        <input
          name="lastName"
          placeholder="Apellido"
          value={formData.lastName}
          onChange={handleChange}
          className="register-input"
        />
        <input
          name="username"
          placeholder="Usuario"
          value={formData.username}
          onChange={handleChange}
          className="register-input"
        />
        <input
          name="email"
          type="email"
          placeholder="Correo electrónico"
          value={formData.email}
          onChange={handleChange}
          className="register-input"
        />
        <input
          name="password"
          type="password"
          placeholder="Contraseña"
          value={formData.password}
          onChange={handleChange}
          className="register-input"
        />
        <select
          name="gender"
          value={formData.gender}
          onChange={handleChange}
          className="register-input"
        >
          <option value="male">Hombre</option>
          <option value="female">Mujer</option>
          <option value="other">Otro</option>
        </select>
        <button className="register-button" type="submit">Registrarse</button>
      </form>
    </div>
  );
};

export default Register;
