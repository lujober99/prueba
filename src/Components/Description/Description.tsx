import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Modal from "react-modal";
import "./Description.css";

Modal.setAppElement("#root");

type PokemonData = {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  height: number;
  weight: number;
  evolutionUrl?: string;
};

type Evolution = {
  name: string;
  image: string;
};

type CharacteristicResponse = {
  descriptions: { language: { name: string }; description: string }[];
};

const Description: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { id } = useParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<PokemonData | null>(null);
  const [description, setDescription] = useState("");
  const [evolutionChain, setEvolutionChain] = useState<Evolution[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("fullPokemonData");
    if (stored) {
      const allPokemon: PokemonData[] = JSON.parse(stored);
      const found = allPokemon.find(p => p.id === parseInt(id || ""));
      setPokemon(found || null);
    }
  }, [id]);

  useEffect(() => {
    const fetchDescription = async () => {
      try {
        const res = await fetch(`https://pokeapi.co/api/v2/characteristic/${id}`);
        const data: CharacteristicResponse = await res.json();
        const spanish = data.descriptions.find(desc => desc.language.name === "en");
        setDescription(spanish ? spanish.description : "Descripción no disponible.");
      } catch (error) {
        console.error("Error al obtener descripción:", error);
        setDescription("Descripción no disponible.");
      }
    };
    fetchDescription();
  }, [id]);

  useEffect(() => {
    const getEvolutionChain = async () => {
      try {
        const evoUrl = pokemon?.evolutionUrl;
        if (!evoUrl) return;

        const evoRes = await fetch(evoUrl);
        const evoData = await evoRes.json();

        const chain: Evolution[] = [];
        let current = evoData.chain;

        while (current) {
          const name = current.species.name;
          const pokeRes = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
          const pokeData = await pokeRes.json();

          chain.push({
            name: name,
            image: pokeData.sprites.other["official-artwork"].front_default,
          });

          current = current.evolves_to[0];
        }

        setEvolutionChain(chain);
      } catch (error) {
        console.error("Error al obtener evolución:", error);
      }
    };

    getEvolutionChain();
  }, [pokemon]);

  if (!pokemon) return <p>Cargando descripción del Pokémon...</p>;

  return (
    <>
      <button onClick={() => navigate('/home')} className="back-button">
        Volver a la galería
      </button>

      <div className="pokemon-card" style={{ maxWidth: "600px", margin: "6px auto", padding: "100px" }}>
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

export default Description;
