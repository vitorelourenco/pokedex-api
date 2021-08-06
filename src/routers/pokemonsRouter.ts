import { Router } from "express";
import * as pokemonsController from "../controllers/pokemonsController";

const pokemonsRouter = Router();

pokemonsRouter.get("/",pokemonsController.getAll);

export default pokemonsRouter;