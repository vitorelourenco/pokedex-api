import "../jestNamespace";
import "../../src/setup";

import supertest from "supertest";
import { getConnection } from "typeorm";

import app, { init } from "../../src/app";
import { createUser } from "../factories/userFactory";
import * as database from "../utils/database";
import { createUserAndSignIn, findSessionWithToken } from "../utils/database";
import toMatchSchema from "../schemas/toMatchSchema";
import headerSchema from "../schemas/headerSchema";

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

describe("POST /sign-in", () => {
  it("should respond with a status 200", async () => {
    const { response } = await createUserAndSignIn();
    expect(response.status).toBe(200);
  });

  it("should respond with an object {'token':'$JWT_TOKEN'}", async () => {
    const { response } = await createUserAndSignIn();
    expect(response.body).toMatchSchema(headerSchema);
  });

  it("should create a new session", async () => {
    const { response } = await createUserAndSignIn();
    const token = response.body.token;
    const session = await findSessionWithToken(token);

    expect(!!session).toBe(true);
  });

  it("should respond with status 400 when the email is not valid", async () => {
    const email = "email";
    const password = "password";
    const response = await agent.post("/sign-in").send({ email, password });
    expect(response.status).toBe(400);
  });

  it("should reject invalid credentials with status 401", async () => {
    const newUser = await createUser({});
    await newUser.saveToDatabase();
    const { email, password } = newUser.reqData;
    const wrongPassword = password + "a";
    const response = await agent
      .post("/sign-in")
      .send({ email, password: wrongPassword });

    expect(response.status).toBe(401);
  });
});
