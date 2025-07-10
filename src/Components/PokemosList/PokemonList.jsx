// src/components/PokemonList.jsx
import React, { useEffect, useState } from "react";

const PokemonList = () => {
  const [loading, setLoading] = useState(true);

  // 1. Trae la lista de todos los Pokémon (solo nombres y URLs)
  const fetchAllPokemonList = async () => {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0");
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error("❌ Error al obtener la lista de Pokémon:", error);
      return [];
    }
  };

  // 2. Trae los detalles de cada Pokémon
  const fetchPokemonDetails = async (url) => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const speciesRes = await fetch(data.species.url);
    const speciesData = await speciesRes.json();
      return {
        id: data.id,
        name: data.name,
        image: data.sprites.front_default,
        types: data.types.map((t) => t.type.name),
        abilities: data.abilities.map((a) => a.ability.name),
        height: data.height,
        weight: data.weight,
        generation: speciesData.generation.name,
      };
    } catch (error) {
      console.error("❌ Error al obtener detalles de Pokémon:", error);
      return null;
    }
  };

  // 3. Carga los datos y los guarda en localStorage
  useEffect(() => {
    const saveFullPokemonData = async () => {
      const alreadyStored = localStorage.getItem("fullPokemonData");
      if (alreadyStored) {
        console.log("✅ Pokémon ya están guardados en localStorage.");
        setLoading(false);
        return;
      }

      console.log("🚀 Cargando Pokémon desde la API...");
      const list = await fetchAllPokemonList();

      const fullData = await Promise.all(
        list.map((pokemon) => fetchPokemonDetails(pokemon.url))
      );

      // Filtra posibles nulos por errores
      const cleanData = fullData.filter(Boolean);

      localStorage.setItem("fullPokemonData", JSON.stringify(cleanData));
      console.log("✅ Pokémon guardados en localStorage.");
      setLoading(false);
    };

    saveFullPokemonData();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {loading ? (
        <p>⏳ Cargando Pokémon...</p>
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default PokemonList;
