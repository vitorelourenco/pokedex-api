import Joi from "joi";

export const pokemonSchema = Joi.object({
  id: Joi.number().integer().min(1).required(),
  name: Joi.string().min(1).required(),
  number: Joi.string().min(1).required(),
  image: Joi.string().min(1).required(),
  weight: Joi.string().min(1).required(),
  height: Joi.string().min(1).required(),
  baseExp: Joi.number().integer().min(1).required(),
  description: Joi.string().min(1).required(),
  inMyPokemons: Joi.boolean().required(),
});

export const pokemonArray = Joi.array().items(pokemonSchema);
