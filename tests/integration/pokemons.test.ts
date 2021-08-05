import "../jestNamespace";
import "../../src/setup";

import supertest from "supertest";
import { getConnection } from "typeorm";

import app, { init } from "../../src/app";
import * as database from "../utils/database";
import {  createUserAndSession } from "../utils/database";
import toMatchSchema from "../schemas/toMatchSchema";
import {pokemonArray} from '../schemas/pokemonSchema';


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

describe("GET /pokemons", () => {
  it("should respond with a status 200", async () => {
    const {header} = await createUserAndSession();
    const response = await agent.get("/pokemons").set(header);
    expect(response.status).toBe(200);
  });

  it("should respond with a status 401 for a bad token", async () => {
    const {header} = await createUserAndSession();
    header.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`
    const response = await agent.get("/pokemons").set(header);
    expect(response.status).toBe(401);
  });

  it("should respond with an array of pokemons", async () => {
    const {header} = await createUserAndSession();
    const response = await agent.get("/pokemons").set(header);
    expect(response.body).toMatchSchema(pokemonArray);
  });
});
