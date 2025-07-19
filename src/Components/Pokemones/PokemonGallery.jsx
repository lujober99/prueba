// src/components/PokemonGallery.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./PokemonGallery.css";
import Search from "../Search/Search.jsx";

const PokemonGallery = ({ pokemonData }) => {
  const [pokemons, setPokemons] = useState(pokemonData || []);
  const [filtered, setFiltered] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [visibleCount, setVisibleCount] = useState(20);
  const [selectedType, setSelectedType] = useState("");
  const [selectedGeneration, setSelectedGeneration] = useState("");
  const [sortOption, setSortOption] = useState("");
  const [restoredFilters, setRestoredFilters] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const navigate = useNavigate();

  // Obtener tipos y generaciones únicos
  const uniqueTypes = [...new Set(pokemons.flatMap((p) => p.types))];
  const uniqueGenerations = [...new Set(pokemons.map((p) => p.generation))];

  // 1. Restaurar filtros desde localStorage al montar
  // Restaurar filtros desde localStorage SOLO si hay data
  useEffect(() => {
    if (pokemonData && pokemonData.length > 0) {
      setPokemons(pokemonData); // solo se actualiza una vez con la data entrante
  
      const savedFilters = JSON.parse(localStorage.getItem("pokemonFilters"));
      if (savedFilters) {
        setSelectedType(savedFilters.selectedType || "");
        setSelectedGeneration(savedFilters.selectedGeneration || "");
        setSortOption(savedFilters.sortOption || "");
        setSearchTerm(savedFilters.searchTerm || "");
      }
  
      setRestoredFilters(true);
    }
  }, [pokemonData]);
  

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
  
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  


  // 2. Guardar filtros en localStorage cada vez que cambien
  useEffect(() => {
    if (restoredFilters) {
      localStorage.setItem(
        "pokemonFilters",
        JSON.stringify({
          selectedType,
          selectedGeneration,
          sortOption,
          searchTerm,
        })
      );
    }
  }, [selectedType, selectedGeneration, sortOption, searchTerm, restoredFilters]);
  

  // 3. Actualizar estado de pokemons desde props
  

  // 4. Scroll infinito
  useEffect(() => {
    const handleScroll = () => {
      const bottom =
        window.innerHeight + window.scrollY >= document.body.offsetHeight - 50;
      if (bottom) {
        setVisibleCount((prev) => prev + 20);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // 5. Aplicar filtros, búsqueda y ordenamiento
  useEffect(() => {
    if (!restoredFilters) return;
  
    let result = [...pokemons];
  
    if (selectedType) {
      result = result.filter((p) => p.types.includes(selectedType));
    }
  
    if (selectedGeneration) {
      result = result.filter((p) => p.generation === selectedGeneration);
    }
  
    if (searchTerm) {
      const lowerTerm = searchTerm.toLowerCase();
      result = result.filter((p) => p.name.toLowerCase().includes(lowerTerm));
    }
  
    if (sortOption === "name-asc") {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-desc") {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sortOption === "id-asc") {
      result.sort((a, b) => a.id - b.id);
    } else if (sortOption === "id-desc") {
      result.sort((a, b) => b.id - a.id);
    }
  
    setFiltered(result);
  }, [pokemons, selectedType, selectedGeneration, sortOption, searchTerm, restoredFilters]);
  

  // 6. Handlers
  const handleSearch = (term) => {
    setSearchTerm(term);
    setVisibleCount(20);
  };

  const handleClearFilters = () => {
    setSelectedType("");
    setSelectedGeneration("");
    setSortOption("");
    setSearchTerm("");
    setVisibleCount(20);
    setFiltered(pokemons);
    localStorage.removeItem("pokemonFilters");
  };

  const handleShuffle = () => {
    const shuffled = [...pokemons].sort(() => Math.random() - 0.5);
    setFiltered(shuffled);
    setVisibleCount(20);
    setSearchTerm("");
  };

  const handleResetOrder = () => {
    setFiltered(pokemons);
    setVisibleCount(20);
    setSearchTerm("");
  };

  // 7. Render
  return (
    <div>
      <div className={`sticky-header ${scrolled ? "scrolled" : ""}`}>
        <button onClick={handleShuffle} className="random-button">
          Mezclar Pokémon Aleatoriamente
        </button>
  
        <button onClick={handleResetOrder} className="reset-button">
          Reiniciar Orden
        </button>
  
        <Search searchTerm={searchTerm} onSearch={handleSearch} />
  
        <div className="filters-container">
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value)}
          >
            <option value="">Ordenar por</option>
            <option value="name-asc">Nombre A-Z</option>
            <option value="name-desc">Nombre Z-A</option>
            <option value="id-asc">ID ascendente</option>
            <option value="id-desc">ID descendente</option>
          </select>
  
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="">Tipo</option>
            {uniqueTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
  
          <select
            value={selectedGeneration}
            onChange={(e) => setSelectedGeneration(e.target.value)}
          >
            <option value="">Generación</option>
            {uniqueGenerations.map((generation) => (
              <option key={generation} value={generation}>
                {generation}
              </option>
            ))}
          </select>
  
          <button onClick={handleClearFilters} className="clear-filters-button">
            Limpiar Filtros
          </button>
        </div>
      </div>
  
      <h2>Total de Pokémones: {filtered.length}</h2>
  
      <div className="pokemon-gallery">
        {filtered.slice(0, visibleCount).map((p) => (
          <div
            key={p.id}
            className="pokemon-card"
            onClick={() => navigate(`/pokemon/${p.id}`)}
          >
            <h3 className="ID">{p.id}</h3>
            <img src={p.image} alt={p.name} />
            <h4>{p.name}</h4>
            <p>
              <strong>Tipos:</strong> {p.types.join(", ")}
            </p>
            <p>
              <strong>Generación:</strong> {p.generation}
            </p>
            <p>
              <strong>Habilidades:</strong> {p.abilities}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
  
};

export default PokemonGallery;
