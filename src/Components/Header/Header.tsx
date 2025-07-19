// src/components/Header.tsx
import React from "react";
import PokeDex from "../../assets/PokeDex.png";
import "./Header.css";
import User from "../User/User";
import Pokebola from "../../assets/Pokebola.png"; // Asegúrate de que la ruta sea correcta

const Header: React.FC = () => {
  return (
    <header className="header">
      <img className="poke" src={Pokebola} alt="" />
      <div className="titulo">
        <img src={PokeDex} alt="Logo" />
      </div>
      <img className="poke" src={Pokebola} alt="" />
      <User />

    </header>
  );
};

export default Header;
