import supertest from "supertest";
import { getConnection, getRepository } from "typeorm";
import app from "../../src/app";
import { createUser } from "../factories/userFactory";
import User from "../../src/entities/User";
import Session from "../../src/entities/Session";
import jwt from "jsonwebtoken";

export async function reset() {
  const connection = getConnection();

  await connection.query(`DELETE FROM "users_pokemons_pokemons"`);
  await connection.query(`DELETE FROM sessions`);
  await connection.query(`DELETE FROM users`);

  await connection.query(`ALTER SEQUENCE "sessions_id_seq" RESTART WITH 1`);
  await connection.query(`ALTER SEQUENCE "users_id_seq" RESTART WITH 1`);

  for(let i=0; i<5; i++){
    const user = await createUser({});
    await user.saveToDatabase();
  }
}

export async function createAndSignIn(){
  const user = await createUser({});
  await user.saveToDatabase();
  const {email, password} = user.reqData;
  const response = await supertest(app).post("/sign-in").send({email,password});
  return {user, response, email, password}
}

export async function createUserAndSession(){
  const user = await createUser({});
  await user.saveToDatabase();
  const {email,password} = user.reqData;
  const userRepository = getRepository(User);
  const dbUser = await userRepository.findOne({email});
  const sessionRepository = getRepository(Session);
  const newSession = sessionRepository.create({user:dbUser});
  await sessionRepository.save(newSession);
  const sessionId = newSession.id;
  const key = process.env.JWT_SECRET;
  const token = jwt.sign({sessionId}, key);
  const header = {Authorization:`Bearer ${token}`}
  return {user, token, email, password, header}
}