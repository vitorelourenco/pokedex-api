import { NextFunction, Request, Response } from "express";

import * as pokemonsService from "../services/pokemonsService";

export async function getAll(req: Request, res: Response, next: NextFunction) {
  try{
    const user = res.locals.user;

    const pokemons = await pokemonsService.getAll(user.id);

    res.send(pokemons);
  } catch (err) {
    next(err);
  }
}
