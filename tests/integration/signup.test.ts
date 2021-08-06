import "../jestNamespace";
import "../../src/setup";

import supertest from "supertest";
import { getConnection } from "typeorm";

import app, { init } from "../../src/app";
import { createUser } from "../factories/userFactory";
import * as database from "../utils/database";
import { findUserWithEmail } from "../utils/database";

import toMatchSchema from "../schemas/toMatchSchema";

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

describe("POST /sign-up", () => {
  it("should respond with status 201(success) or 409(conflict) ", async () => {
    const user = await createUser({});

    //conflict check is done over volatile data => shooting 2 requests
    //if the app instance does not find a conflict where there is one
    //database will throw and status should be 500 (no tests for this)
    const firstResponse = await agent.post("/sign-up").send(user.reqData);
    const secondResponse = await agent.post("/sign-up").send(user.reqData);

    expect(firstResponse.status).toBe(201);
    expect(secondResponse.status).toBe(409);
  });

  it("should add user to database ", async () => {
    const user = await createUser({});
    const dbUserBefore = await findUserWithEmail(user.reqData.email);
    await agent.post("/sign-up").send(user.reqData);
    const dbUserAfter = await findUserWithEmail(user.reqData.email);

    const userWasAdded = !!(dbUserBefore ?? dbUserAfter);
    expect(userWasAdded).toBe(true);
  });

  it("should respond with status 400 when passwords dont match", async () => {
    const user = await createUser({ password: "b", confirmPassword: "a" });
    const response = await agent.post("/sign-up").send(user.reqData);

    expect(response.status).toBe(400);
  });

  it("should respond with status 400 when body has no valid email", async () => {
    const user = await createUser({ email: "a" });
    const response = await agent.post("/sign-up").send(user.reqData);

    expect(response.status).toBe(400);
  });

  it("should respond with status 400 when body has no valid password", async () => {
    const user = await createUser({ password: "" });
    const response = await agent.post("/sign-up").send(user.reqData);

    expect(response.status).toBe(400);
  });

  it("should not store the password", async () => {
    const user = await createUser({});
    await agent.post("/sign-up").send(user.reqData);
    const dbUser = await findUserWithEmail(user.reqData.email);
    expect(dbUser.password).not.toBe(user.reqData.password);
  });
});
