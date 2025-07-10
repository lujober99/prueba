// src/components/PokemonGallery.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PokemonGallery.css";
import Search from "../Search/Search.jsx";

const PokemonGallery = () => {
  const [pokemons, setPokemons] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem("fullPokemonData");
    if (stored) {
      const parsed = JSON.parse(stored);
      setPokemons(parsed);
      setFiltered(parsed);
    }
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      if (bottom) {
        setVisibleCount((prev) => prev + 20); // carga 20 más
      }
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  

  const handleSearch = (term) => {
    setSearchTerm(term);
    setVisibleCount(20);
    const lowerTerm = term.toLowerCase();
    const result = pokemons.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerTerm) ||
        p.types.some((type) => type.toLowerCase().includes(lowerTerm))
    );
    setFiltered(result);
  };

  return (
    <div>
      <Search searchTerm={searchTerm} onSearch={handleSearch} />
      <h2>Total de Pokémones: {filtered.length}</h2>
      <div className="pokemon-gallery">
      {filtered.slice(0, visibleCount).map((p) => (
  <div key={p.id} className="pokemon-card" onClick={() => navigate(`/pokemon/${p.id}`)}>
    <h3 className="ID">{p.id}</h3>
    <img src={p.image} alt={p.name} />
    <h4>{p.name}</h4>
    
    <p><strong>Tipos:</strong> {p.types.join(", ")}</p>
    <p><strong>Habilidades:</strong> {p.abilities.join(", ")}</p>
  </div>
))}
      </div>
    </div>
  );
};

export default PokemonGallery;
