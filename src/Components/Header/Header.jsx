import React, { Component } from 'react'
import PokeDex from "../../assets/PokeDex.png";
import './Header.css'
import User from '../User/User';
import Pokebola from "../../assets/pokebola.png";



 const Header= () => {
    return (
        <header className="header">
            
            <img className='poke' src={Pokebola} alt="" />
            <div class="titulo">
  <img src={PokeDex} alt="Logo" />
</div>
            <img className='poke' src={Pokebola} alt="" />

            <User></User>
        </header>
    )
  
}

export default Header
