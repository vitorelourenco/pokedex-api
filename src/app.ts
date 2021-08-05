import "./setup";

import express from "express";
import cors from "cors";
import "reflect-metadata";

import connectDatabase from "./database";

import myPokemonsRouter from "./routers.ts/myPokemonsRouter";
import pokemonsRouter from "./routers.ts/pokemonsRouter";
import signinRouter from "./routers.ts/signinRouter";
import signupRouter from "./routers.ts/signupRouter";
import auth from "./chokepoints/auth";
import err from "./chokepoints/err";
import { loadEmails } from "./services/userService";
import {Request, Response} from 'express';

const app = express();
app.use(cors());
app.use(express.json());

app.use("/sign-up", signupRouter);
app.use("/sign-in", signinRouter);
app.use("/pokemons", auth, pokemonsRouter);
app.use("/my-pokemons", auth, myPokemonsRouter);


app.use("/", (req:Request,res:Response)=>{
  res.sendStatus(200);
})

app.use(err);

export async function init () {
  await connectDatabase();
  await loadEmails();
}

export default app;
