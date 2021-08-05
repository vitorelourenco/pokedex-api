import "../jestNamespace";
import "../../src/setup";

import supertest from "supertest";
import { getConnection, getRepository } from "typeorm";

import app, { init } from "../../src/app";
import { createUser } from "../factories/userFactory";
import * as database from "../utils/database";
import { createAndSignIn } from "../utils/database";
import toMatchSchema from "../schemas/toMatchSchema";
import tokenSchema from "../schemas/tokenSchema";
import jwt from 'jsonwebtoken';
import { Session } from "inspector";

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
    const {response} = await createAndSignIn();
    expect(response.status).toBe(200);
  });

  it("should respond with status 400 when the email is not valid", async () => {
    const email = "email";
    const password = "password";
    const response = await agent.post("/sign-in").send({email,password});
    expect(response.status).toBe(400);
  });

  it("should respond with a JWT {'token':'$TOKEN'}", async () => {
    const {response} = await createAndSignIn();
    expect(response.body).toMatchSchema({tokenSchema});
  });

  it("should start a new session for the user", async () => {
    const {response} = await createAndSignIn();
    const token = response.body.token;
    const key = process.env.JWT_SECRET;
    const data = JSON.parse(jwt.verify(token, key).toString());
    const sessionId = data?.sessionId;
    const hasSession = !!getRepository(Session).findOne({where:{id:sessionId}})

    expect(hasSession).toBe(true);
  });

  it("should reject invalid credentials with status 401", async () => {
    const {email, password} = await createAndSignIn();
    const newEmail = email;
    const newPassword = password + "a"
    const response = await agent.post("/sign-in").send({newEmail,newPassword});
    
    expect(response.status).toBe(401);
  });
});

