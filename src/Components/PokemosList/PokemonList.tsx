import React, { useEffect, useState, useCallback } from "react";
import PokemonGallery from "../Pokemones/PokemonGallery";

interface PokemonListItem {
  name: string;
  url: string;
}

interface PokemonDetails {
  id: number;
  name: string;
  image: string;
  types: string[];
  abilities: string[];
  height: number;
  weight: number;
  evolutionUrl: string;
  generation: string;
}

const PokemonList: React.FC = () => {
  const [pokemonData, setPokemonData] = useState<PokemonDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchAllPokemonList = useCallback(async (): Promise<PokemonListItem[]> => {
    try {
      const res = await fetch("https://pokeapi.co/api/v2/pokemon?limit=10000&offset=0");
      const data = await res.json();
      return data.results;
    } catch (error) {
      console.error("❌ Error al obtener la lista de Pokémon:", error);
      return [];
    }
  }, []);

  const fetchPokemonDetails = useCallback(async (url: string): Promise<PokemonDetails | null> => {
    try {
      const res = await fetch(url);
      const data = await res.json();
      const speciesRes = await fetch(data.species.url);
      const speciesData = await speciesRes.json();

      return {
        id: data.id,
        name: data.name,
        image: data.sprites.other["official-artwork"].front_default || data.sprites.front_default || "",
        types: data.types.map((t: { type: { name: string } }) => t.type.name),
        abilities: data.abilities.map((a: { ability: { name: string } }) => a.ability.name),
        height: data.height,
        weight: data.weight,
        evolutionUrl: speciesData.evolution_chain.url,
        generation: speciesData.generation.name,
      };
    } catch (error) {
      console.error("❌ Error al obtener detalles de Pokémon:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const loadAndSavePokemon = async () => {
      let storedData: PokemonDetails[] = JSON.parse(localStorage.getItem("fullPokemonData") || "[]");
      const isFullyLoaded = localStorage.getItem("isFullyLoaded");
      setPokemonData(storedData);

      if (isFullyLoaded === "true") {
        setLoading(false);
        return;
      }

      const allList = await fetchAllPokemonList();
      const remaining = allList.slice(storedData.length);

      const batchSize = 20;
      for (let i = 0; i < remaining.length; i += batchSize) {
        const batch = remaining.slice(i, i + batchSize);
        const batchData = await Promise.all(batch.map((p) => fetchPokemonDetails(p.url)));
        const cleaned = batchData.filter(Boolean) as PokemonDetails[];

        storedData = [...storedData, ...cleaned];
        localStorage.setItem("fullPokemonData", JSON.stringify(storedData));
        setPokemonData([...storedData]);

        await new Promise((r) => setTimeout(r, 200));
      }

      setLoading(false);
      localStorage.setItem("isFullyLoaded", "true");
    };

    loadAndSavePokemon();
  }, [fetchAllPokemonList, fetchPokemonDetails]);

  return (
    <div style={{ textAlign: "center", marginTop: "2rem" }}>
      {loading && <p>⏳ Cargando Pokémon... {pokemonData.length}</p>}
      <PokemonGallery pokemonData={pokemonData} />
    </div>
  );
};

export default PokemonList;
