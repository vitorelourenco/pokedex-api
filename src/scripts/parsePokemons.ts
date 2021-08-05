import { writeFileSync, readFileSync } from "fs";
import Pokemon from "../entities/Pokemon";

function readPokemons() {
  return JSON.parse(readFileSync("./pokemons.json").toString());
}

const pokemons = readPokemons();

const parsedPokemons: Pokemon = pokemons.map((pokemon: any) => {
  const {
    id: number,
    name,
    weight,
    height,
    base_experience: baseExp,
  } = pokemon;
  const image = pokemon.sprites["front_default"];
  const description = pokemon.species["flavor_text_entries"].find(
    (entry: any) => entry.language.name === "en"
  )?.["flavor_text"];
  return {
    name,
    number,
    image,
    weight,
    height,
    baseExp,
    description,
  };
});

writeFileSync("./parsedPokemons.json", JSON.stringify(parsedPokemons));
