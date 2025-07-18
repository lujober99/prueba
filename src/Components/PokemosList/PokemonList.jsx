// src/components/PokemonList.jsx
import React, { useEffect, useState } from "react";
import PokemonGallery from "../Pokemones/PokemonGallery.jsx";

const PokemonList = () => {
  const [loading, setLoading] = useState(true);
  const [pokemonData, setPokemonData] = useState([]);
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
      try {
        const alreadyStored = localStorage.getItem("fullPokemonData");
        if (alreadyStored) {
          console.log("✅ Pokémon ya están guardados en localStorage.");
          setPokemonData(JSON.parse(alreadyStored)); // <- Cargar del localStorage
          setLoading(false);
          return;
        }
  
        console.log("🚀 Cargando Pokémon desde la API...");
        const list = await fetchAllPokemonList();
  
        const fullData = await fetchInBatches(list, 20); // Puedes ajustar 
  
        const cleanData = fullData.filter(Boolean);
  
        localStorage.setItem("fullPokemonData", JSON.stringify(cleanData));
        setPokemonData(cleanData);  // <- Actualizar estado con los nuevos datos
        console.log("✅ Pokémon guardados en localStorage.");
      } catch (error) {
        console.error("❌ Error general en la carga de Pokémon:", error);
      } finally {
        setLoading(false); // Solo se llama una vez, al final
      }
    };
  
    const fetchInBatches = async (urls, batchSize = 20) => {
      const results = [];
    
      for (let i = 0; i < urls.length; i += batchSize) {
        const batch = urls.slice(i, i + batchSize);
        const batchResults = await Promise.all(
          batch.map((pokemon) => fetchPokemonDetails(pokemon.url))
        );
        const cleanBatch = batchResults.filter(Boolean); // <- importante
    
        results.push(...cleanBatch);
    
        // ✅ Mostrar y guardar los Pokémon hasta este momento
        setPokemonData([...results]); // muestra en tiempo real
        localStorage.setItem("fullPokemonData", JSON.stringify(results));
      }
    
      return results;
    };
  
    saveFullPokemonData();
  }, []);
  

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {loading ? (
        <p>⏳ Cargando Pokémon...</p>
      ) : (
        <PokemonGallery pokemonData={pokemonData} />
      )}
    </div>
  );
};

export default PokemonList;
