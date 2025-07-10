// src/components/PokemonList.jsx
import React, { useEffect, useState } from "react";

const PokemonList = () => {
  const [loading, setLoading] = useState(true);

  const fetchAllPokemonList = async () => {
    const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=100000&offset=0");
    const data = await res.json();
    return data.results;
  };

  const fetchPokemonDetails = async (url) => {
    const res = await fetch(url);
    const data = await res.json();

    return {
      id: data.id,
      name: data.name,
      image: data.sprites.front_default,
      types: data.types.map((t) => t.type.name),
      abilities: data.abilities.map((a) => a.ability.name),
      height: data.height,
      weight: data.weight,
    };
  };

  useEffect(() => {
    const saveFullPokemonData = async () => {
      if (localStorage.getItem("fullPokemonData")) {
        console.log("Pokémon ya están guardados");
        setLoading(false);
        return;
      }

      const list = await fetchAllPokemonList();

      
      const fullData = await Promise.all(
        list.map((pokemon) => fetchPokemonDetails(pokemon.url))
      );

      localStorage.setItem("fullPokemonData", JSON.stringify(fullData));
      console.log("Pokémon guardados en localStorage");
      setLoading(false);
    };

    saveFullPokemonData();
  }, []);

  return (
    <div>
      {loading ? (
        <p>Cargando Pokémon...</p>
      ) : (
        <p>¡Pokémon guardados exitosamente en tu localStorage!</p>
      )}
      
    </div>
  );
};

export default PokemonList;
