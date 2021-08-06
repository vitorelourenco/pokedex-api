import { getRepository, getConnection } from "typeorm";
import Pokemon from "../entities/Pokemon";
import User from "../entities/User";

export async function add(userId: number, pokemonId: number) {
  const user = await getRepository(User).findOne({
    where: { id: userId },
    relations: ["pokemons"],
  });
  const pokemon = await getRepository(Pokemon).findOne({ id: pokemonId });
  user.pokemons.push(pokemon);
  await getRepository(User).save(user);
}
