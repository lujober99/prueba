import React, { Component, use, useEffect, useState } from 'react'
import { data, useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import './Description.css';

Modal.setAppElement("#root");

const Description = () => {
    const [isOpen, setIsOpen] = useState(false);
    
    const { id } = useParams();
    const [pokemon, setPokemon] = useState(null);
    const [description, setDescription] = useState("");
    const [evolutionChain, setEvolutionChain] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const stored = localStorage.getItem("fullPokemonData");
        if (stored) {
            const allPokemon = JSON.parse(stored);
            const found = allPokemon.find(p => p.id === parseInt(id));
            setPokemon(found);
        }
    }, [id]);

    useEffect(() => {
        fetch(`https://pokeapi.co/api/v2/characteristic/${id}`)
            .then(response => response.json())
            .then(data => {
                const spanish = data.descriptions.find(desc => desc.language.name === "en");
                setDescription(spanish ? spanish.description : "Descripción no disponible.");
            })
            .catch(error => {
                console.error("Error al obtener descripción:", error);
                setDescription("Descripción no disponible.");
                
            })
            .catch(error => {
                console.error("Error fetching description:", error);
                setDescription({ description: "Descripción no disponible" });
            });
    }, []);
    useEffect(() => {
        const getEvolutionChain = async () => {
          try {
            // 1. Obtener species para conseguir el link de evolución
            const speciesRes = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
            const speciesData = await speciesRes.json();
            const evoUrl = speciesData.evolution_chain.url;
    
            // 2. Obtener datos de la evolución
            const evoRes = await fetch(evoUrl);
            const evoData = await evoRes.json();
    
            // 3. Recorrer la cadena de evolución
            const chain = [];
            let current = evoData.chain;
    
            while (current) {
              const name = current.species.name;
              const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
              const pokeData = await pokeRes.json();
    
              chain.push({
                name: name,
                image: pokeData.sprites.front_default,
              });
    
              current = current.evolves_to[0];
            }
    
            setEvolutionChain(chain);
          } catch (error) {
            console.error("Error al obtener evolución:", error);
          }
        };
    
        getEvolutionChain();
      }, [id]);
    


    if (!pokemon) return <p>Cargando descripción del Pokémon...</p>;

    return (
        <>
        <button onClick={() => navigate('/home')} className="back-button">
  Volver a la galería
</button>

        <div className="pokemon-card">
          <div className="pokemon-description">
            <h2>{pokemon.id} - {pokemon.name}</h2>
      
            <img
              className="img-principal"
              src={pokemon.image}
              alt={pokemon.name}
              onClick={() => setIsOpen(true)}
              style={{ cursor: "zoom-in" }}
            />
      
            <div className="container-description">
              <p><strong>Número:</strong> {pokemon.id}</p>
              <p><strong>Tipos:</strong> {pokemon.types.join(", ")}</p>
              <p><strong>Habilidades:</strong> {pokemon.abilities.join(", ")}</p>
              <p><strong>Altura:</strong> {pokemon.height} decímetros</p>
              <p><strong>Peso:</strong> {pokemon.weight} hectogramos</p>
              <p><strong>Descripción:</strong> {description}</p>
            </div>
      
            <h3>Cadena de Evolución:</h3>
            <div className="evolution-chain">
              {evolutionChain.map((evo, idx) => (
                <div key={idx} style={{ textAlign: 'center' }}>
                  <img className="img-evolution" src={evo.image} alt={evo.name} />
                  <p>{evo.name}</p>
                </div>
              ))}
            </div>
          </div>
      
          <Modal isOpen={isOpen} onRequestClose={() => setIsOpen(false)} className="modal">
            <img src={pokemon.image} alt={pokemon.name} className="zoom-image" />
            <button onClick={() => setIsOpen(false)}>Cerrar</button>
          </Modal>
        </div>
        </>
      );


};

export default Description
