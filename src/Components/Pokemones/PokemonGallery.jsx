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
  const [selectedName, setSelectedName] = useState("");
const [selectedType, setSelectedType] = useState("");
const [selectedGeneration, setSelectedGeneration] = useState("");


const uniqueTypes = [...new Set(pokemons.flatMap(p => p.types))];
const uniqueGenerations = [...new Set(pokemons.map(p => p.generation))];


useEffect(() => {
  let result = [...pokemons];

  

  if (selectedType) {
    result = result.filter(p => p.types.includes(selectedType));
  }

  if ( selectedGeneration) {
    result = result.filter(p => p.generation === selectedGeneration);

  }

  
  setFiltered(result);
  setVisibleCount(20);
}, [selectedName, selectedType, selectedGeneration,  pokemons]);

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
        p.name.toLowerCase().includes(lowerTerm) 
    );
    setFiltered(result);
  }; 
  const handleShuffle = () => {
    const shuffled = [...pokemons].sort(() => Math.random() - 0.5); // copia y mezcla
    setFiltered(shuffled);
    setVisibleCount(20); // opcional: reinicia el scroll
    setSearchTerm("");
      // limpia el input de búsqueda si quieres
  };
  const handleResetOrder = () => {
    setFiltered(pokemons);     // Vuelve a mostrar todos en su orden original
    setVisibleCount(20);       // Reinicia el conteo visible
    setSearchTerm("");         // Limpia el input de búsqueda si quieres
  };

  return (
    <div>
      <button onClick={handleShuffle} className="random-button">
  Mezclar Pokémon Aleatoriamente
</button>

      <button onClick={handleResetOrder} className="reset-button">
  Reiniciar Orden
</button>
<Search searchTerm={searchTerm} onSearch={handleSearch} /> 
<div className="filters-container">
 
  
  <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
    <option value="">Tipo</option>
    {uniqueTypes.map(type => (
      <option key={type} value={type}>{type}</option>
    ))} 
  </select>

  <select value={selectedGeneration} onChange={(e) => setSelectedGeneration(e.target.value)}>
    <option value="">Generacion</option>
    {uniqueGenerations.map(generation => (
      <option key={generation} value={generation}>{generation}</option>
    ))} 
  </select>

 
</div>
       
      <h2>Total de Pokémones: {filtered.length}</h2>
      <div className="pokemon-gallery">
      {filtered.slice(0, visibleCount).map((p) => (
  <div key={p.id} className="pokemon-card" onClick={() => navigate(`/pokemon/${p.id}`)}>
    <h3 className="ID">{p.id}</h3>
    <img src={p.image} alt={p.name} />
    <h4>{p.name}</h4>
    
    <p><strong>Tipos:</strong> {p.types.join(", ")}</p>
    <p><strong>Generacion: </strong>{p.generation}</p>
    <p><strong>Habilidades:</strong> {p.abilities}</p>
  </div>
))}
      </div>
    </div>
  );
};

export default PokemonGallery;
