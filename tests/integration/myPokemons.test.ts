import "../jestNamespace";
import "../../src/setup";

import supertest from "supertest";
import { getConnection } from "typeorm";

import app, { init } from "../../src/app";
import * as database from "../utils/database";
import {
  createUserWithSession,
  createUserWithSessionAndPokemon,
  getUserWithPokemons,
  userHasPokemon,
} from "../utils/database";
import toMatchSchema from "../schemas/toMatchSchema";
import * as velMath from '../utils/velMath';

expect.extend({ toMatchSchema });

beforeAll(async () => {
  await init();
});

beforeEach(async () => {
  await database.reset();
});

afterAll(async () => {
  await getConnection().close();
});

const agent = supertest(app);

describe("POST /my-pokemons/:id/add", () => {
  it("should respond with status 200", async () => {
    const { header } = await createUserWithSession();
    const pokemonId = velMath.drawInteger(1,898);
    const response = await agent.post(`/my-pokemons/${pokemonId}/add`).set(header);
    expect(response.status).toBe(200);
  });

  it("should respond with status 401 for a bad token", async () => {
    const { header } = await createUserWithSession();
    const pokemonId = velMath.drawInteger(1,898);
    header.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
    const response = await agent.post(`/my-pokemons/${pokemonId}/add`).set(header);
    expect(response.status).toBe(401);
  });

  it("should add a pokemon to users pokemons", async () => {
    const { header, user } = await createUserWithSession();
    const pokemonId = velMath.drawInteger(1,898);
    await agent.post(`/my-pokemons/${pokemonId}/add`).set(header);
    const dbUser = await getUserWithPokemons(user.reqData.email);
    const hasPokemon = userHasPokemon(dbUser, pokemonId);
    expect(hasPokemon).toBe(true);
  });
});

describe("POST /my-pokemons/:id/remove", () => {
  it("should respond with a status 200", async () => {
    const pokemonId = velMath.drawInteger(1,898);
    const { header } = await createUserWithSessionAndPokemon(pokemonId);
    const response = await agent.post(`/my-pokemons/${pokemonId}/remove`).set(header);
    expect(response.status).toBe(200);
  });

  it("should respond with a status 401 for a bad token", async () => {
    const pokemonId = velMath.drawInteger(1,898);
    const { header } = await createUserWithSessionAndPokemon(pokemonId);
    header.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
    const response = await agent.post(`/my-pokemons/${pokemonId}/remove`).set(header);
    expect(response.status).toBe(401);
  });

  it("should remove pokemon from users pokemons", async () => {
    const pokemonId = velMath.drawInteger(1,898);
    const { header, user } = await createUserWithSessionAndPokemon(pokemonId);
    const userBefore = await getUserWithPokemons(user.reqData.email);
    const hadPokemon = userHasPokemon(userBefore, pokemonId);
    
    await agent.post(`/my-pokemons/${pokemonId}/remove`).set(header);
    const userAfter = await getUserWithPokemons(user.reqData.email);
    const hasPokemon = userHasPokemon(userAfter, pokemonId);
    expect([hadPokemon, hasPokemon]).toEqual([true, false]);
  });
});
