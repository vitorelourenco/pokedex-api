import { NextFunction, Request, Response } from "express";
import { DeepValidationError } from "../protocols/DeepValidationError";

import * as myPokemonsService from "../services/myPokemonsService";

export async function updatePokemons(req: Request, res: Response, next: NextFunction) {
  try{
    const {id, action} = req.params;
    if(!["add","remove"].includes(action)){
      throw new DeepValidationError(404,"page not found");
    }
    const pokemonId = parseInt(id);
    if(!pokemonId || pokemonId<1){
      throw new DeepValidationError(404,"page not found");
    }

    const user = res.locals.user;
    const userId = user.id;

    if(action === "add"){
      await myPokemonsService.add(userId, pokemonId);
    } else if (action === "remove"){
      // await myPokemonsService.remove(user.id);
    }

    res.sendStatus(200);
  } catch (err) {
    next(err);
  }
}
