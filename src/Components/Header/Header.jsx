import React, { Component } from 'react'
import PokeDex from "../../assets/PokeDex.png";
import './Header.css'
import User from '../User/User';
import Pokebola from "../../assets/pokebola.png";



 const Header= () => {
    return (
        <header className="header">
            
            <img src={Pokebola} alt="" />
            <img src={PokeDex} alt="Poko Dex" />
            <img src={Pokebola} alt="" />

            <User></User>
        </header>
    )
  
}

export default Header
