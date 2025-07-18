import React, { useEffect, useState } from "react";
import PokemonGallery from "../Pokemones/PokemonGallery.jsx";

const PokemonList = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const loadAndSavePokemon = async () => {
      let storedData = JSON.parse(localStorage.getItem("fullPokemonData") || "[]");
      setPokemonData(storedData); // Mostrar lo que ya hay en localStorage

      const allList = await fetchAllPokemonList();
      const remaining = allList.slice(storedData.length);

      const batchSize = 20;
      for (let i = 0; i < remaining.length; i += batchSize) {
        const batch = remaining.slice(i, i + batchSize);
        const batchData = await Promise.all(batch.map((p) => fetchPokemonDetails(p.url)));
        const cleaned = batchData.filter(Boolean);

        storedData = [...storedData, ...cleaned];
        localStorage.setItem("fullPokemonData", JSON.stringify(storedData));
        setPokemonData([...storedData]); // 🔁 actualiza para mostrar nuevos

        await new Promise((r) => setTimeout(r, 200)); // Pausa para evitar saturación
      }

      setLoading(false);
    };

    loadAndSavePokemon();
  }, []);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {loading && <p>⏳ Cargando Pokémon... {pokemonData.length}</p>}
      <PokemonGallery pokemonData={pokemonData} />
    </div>
  );
};

export default PokemonList;
