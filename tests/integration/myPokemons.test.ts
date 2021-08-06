import "../jestNamespace";
import "../../src/setup";

import supertest from "supertest";
import { getConnection, getRepository } from "typeorm";

import app, { init } from "../../src/app";
import * as database from "../utils/database";
import { createUserAndSession, createUserWithPokemonAndSession } from "../utils/database";
import toMatchSchema from "../schemas/toMatchSchema";
import User from "../../src/entities/User";

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
  it("should respond with a status 200", async () => {
    const { header } = await createUserAndSession();
    const response = await agent.post("/my-pokemons/1/add").set(header);
    expect(response.status).toBe(200);
  });

  it("should respond with a status 401 for a bad token", async () => {
    const { header } = await createUserAndSession();
    header.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
    const response = await agent.post("/my-pokemons/1/add").set(header);
    expect(response.status).toBe(401);
  });

  it("should add pokemon id 1 to users pokemons", async () => {
    const { header, user } = await createUserAndSession();
    const response = await agent.post("/my-pokemons/1/add").set(header);
    const dbUser = await getRepository(User).findOne({
      relations: ["pokemons"],
      where: { email: user.reqData.email },
    });
    const contains = !!dbUser?.pokemons?.find((pokemon)=>pokemon.id === 1)
    expect(contains).toBe(true);
  });
});

describe("POST /my-pokemons/:id/remove", () => {
  it("should respond with a status 200", async () => {
    const { header } = await createUserWithPokemonAndSession();
    const response = await agent.post("/my-pokemons/1/remove").set(header);
    expect(response.status).toBe(200);
  });

  it("should respond with a status 401 for a bad token", async () => {
    const { header } = await createUserWithPokemonAndSession();
    header.Authorization = `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c`;
    const response = await agent.post("/my-pokemons/1/add").set(header);
    expect(response.status).toBe(401);
  });

  it("should remove pokemon id 1 from users pokemons", async () => {
    const { header, user } = await createUserWithPokemonAndSession(1);
    await agent.post("/my-pokemons/1/remove").set(header);
    const updatedUser = await getRepository(User).findOne({
      relations: ["pokemons"],
      where: { email: user.reqData.email },
    });
    const contains = !updatedUser?.pokemons?.find((pokemon)=>pokemon.id === 1)
    expect(contains).toBe(true);
  });
});
