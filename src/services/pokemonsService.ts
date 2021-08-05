import { getRepository } from "typeorm";
import Pokemon from "../entities/Pokemon";
import ResPokemon from "../protocols/ResPokemon";
import User from "../entities/User";

const emails: { [key: string]: boolean } = {};

export async function loadEmails() {
  const userList = await getRepository(User).find({ select: ["email"] });
  userList.forEach((user) => (emails[user.email] = true));
}

export async function getAll(userId: number) {
  const pokemonsRepository = getRepository(Pokemon);
  const pokemons = await pokemonsRepository.find();

  const userRepository = getRepository(User);
  const userWithPokemons = await userRepository.findOne({
    relations: ["pokemons"],
    where: { id: userId },
  });

  const pokemonsWithUserStatus = pokemons.map((pokemon) => {
    const { id, name, number, image, weight, height, baseExp, description } =
      pokemon;
    const inMyPokemons = !!userWithPokemons.pokemons.find(
      (pokemon: Pokemon) => pokemon.id === id
    );
    const out: ResPokemon = {
      id,
      name,
      number,
      image,
      weight,
      height,
      baseExp,
      description,
      inMyPokemons,
    };
    return out;
  });

  return pokemonsWithUserStatus;
}
