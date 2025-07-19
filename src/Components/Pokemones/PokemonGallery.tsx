// src/components/PokemonGallery.tsx
import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./PokemonGallery.css";
import Search from "../Search/Search";

// Tipos para Pokémon
interface Pokemon {
  id: number;
  name: string;
  image: string;
  types: string[];
  generation: string;
  abilities: string[]; 
}

interface Props {
  pokemonData: Pokemon[];
}

const PokemonGallery: React.FC<Props> = ({ pokemonData }) => {
  const [pokemons, setPokemons] = useState<Pokemon[]>(pokemonData || []);
  const [filtered, setFiltered] = useState<Pokemon[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [visibleCount, setVisibleCount] = useState<number>(20);
  const [selectedType, setSelectedType] = useState<string>("");
  const [selectedGeneration, setSelectedGeneration] = useState<string>("");
  const [sortOption, setSortOption] = useState<string>("");
  const [restoredFilters, setRestoredFilters] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [menuOpen, setMenuOpen] = useState<boolean>(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [checkingScroll, setCheckingScroll] = useState(false);


  const navigate = useNavigate();

  const uniqueTypes = [...new Set(pokemons.flatMap((p) => p.types))];
  const uniqueGenerations = [...new Set(pokemons.map((p) => p.generation))];

  useEffect(() => {
    if (pokemonData && pokemonData.length > 0) {
      setPokemons(pokemonData);

      const savedFilters = JSON.parse(localStorage.getItem("pokemonFilters") || "{}");
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

  useEffect(() => {
    const checkIfNoScroll = () => {
      const noScroll = document.body.scrollHeight <= window.innerHeight + 20;
  
      if (noScroll && !checkingScroll && visibleCount < pokemonData.length) {
        setCheckingScroll(true); // 🚫 evita que dispare varias veces seguidas
        setVisibleCount((prev) => prev + 20);
      }
    };
  
    // Esperar un pequeño delay para asegurar render del DOM
    const timeout = setTimeout(checkIfNoScroll, 100); // puedes ajustar a 200ms si hace falta
  
    return () => clearTimeout(timeout);
  }, [pokemonData, visibleCount, checkingScroll]);

  useEffect(() => {
    setCheckingScroll(false); // 🔁 permite que vuelva a chequear en el próximo render
  }, [visibleCount]);
  

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

  const handleSearch = (term: string) => {
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
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
  
      if (
        menuOpen &&
        sidebarRef.current &&
        !sidebarRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMenuOpen(false);
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);
  

  return (
    <div>
      <div>
      {/* Botón para abrir/cerrar menú */}
      <button ref={buttonRef} className="sidebar-toggle" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </button>

      {/* Sidebar desplegable */}
      <div ref={sidebarRef} className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className={`sticky-header ${scrolled ? "scrolled" : ""}`}>
          <button onClick={handleShuffle} className="random-button">
            Mezclar Pokémon Aleatoriamente
          </button>

          <button onClick={handleResetOrder} className="reset-button">
            Reiniciar Orden
          </button>

          <Search searchTerm={searchTerm} onSearch={handleSearch} />

          <div className="filters-container">
            <select value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
              <option value="">Ordenar por</option>
              <option value="name-asc">Nombre A-Z</option>
              <option value="name-desc">Nombre Z-A</option>
              <option value="id-asc">ID ascendente</option>
              <option value="id-desc">ID descendente</option>
            </select>

            <select value={selectedType} onChange={(e) => setSelectedType(e.target.value)}>
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
      </div>

      <h2 style={{ textAlign: "center", marginTop: "20px" }}>
        Total de Pokémones: {filtered.length}
      </h2>

      <div className="pokemon-gallery" >
        {filtered.slice(0, visibleCount).map((p) => (
          <div key={p.id} className="pokemon-card" onClick={() => navigate(`/pokemon/${p.id}`)}>
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
              <strong>Habilidades:</strong> {p.abilities.join(", ")}
            </p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default PokemonGallery;
