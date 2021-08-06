import { Router } from "express";
import * as myPokemonsController from '../controllers/myPokemonsController';
const myPokemonsRouter = Router();

myPokemonsRouter.post("/:id/:action", myPokemonsController.updatePokemons)

export default myPokemonsRouter;