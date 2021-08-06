import { getRepository } from "typeorm";
import Pokemon from "../entities/Pokemon";
import ResPokemon from "../protocols/ResPokemon";
import User from "../entities/User";

const pokemonTable: ResPokemon[] = [];

export async function loadPokemons() {
  const pokemonsList = await getRepository(Pokemon).find();
  pokemonsList.forEach(
    (pokemon) =>{
      const pokemonRow = { ...pokemon, inMyPokemons: false };
      Object.freeze(pokemonRow);
      pokemonTable.push(pokemonRow);
    }
  );
}

export async function getAll(userId: number) {
  const userRepository = getRepository(User);
  const userWithPokemons = await userRepository.findOne({
    relations: ["pokemons"],
    where: { id: userId },
  });

  const pokemons = [...pokemonTable];
  userWithPokemons.pokemons.forEach(
    (pokemon) => {
      pokemons[pokemon.id-1] = {...pokemons[pokemon.id-1]};
      pokemons[pokemon.id-1].inMyPokemons = true;
    }
  );

  return pokemons;
}
