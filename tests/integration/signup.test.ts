import "../jestNamespace";
import "../../src/setup";

import supertest from "supertest";
import { getConnection } from "typeorm";

import app, { init } from "../../src/app";
import { createUser } from "../factories/userFactory";
import * as database from "../utils/database";
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
  it("should respond with status 201", async () => {
    const user = await createUser({});
    const response = await agent.post("/sign-up").send(user.reqData);

    expect(response.status).toBe(201);
  });
});

describe("POST /sign-up", () => {
  it("should respond with status 400 when passwords dont match", async () => {
    const user = await createUser({ password: "b", confirmPassword: "a" });
    const response = await agent.post("/sign-up").send(user.reqData);

    expect(response.status).toBe(400);
  });
});

describe("POST /sign-up", () => {
  it("should respond with status 400 when body has no valid email", async () => {
    const user = await createUser({ email: "a" });
    const response = await agent.post("/sign-up").send(user.reqData);

    expect(response.status).toBe(400);
  });
});

describe("POST /sign-up", () => {
  it("should respond with status 400 when body has no valid password", async () => {
    const user = await createUser({ password: "" });
    const response = await agent.post("/sign-up").send(user.reqData);

    expect(response.status).toBe(400);
  });
});

describe("POST /sign-up", () => {
  it("should respond with status 409 when email is taken", async () => {
    const user = await createUser({});

    //conflict check is done over volatile data, shooting 2 requests
    //if conflict checked -> status 409 , if conflict happened unchecked -> status 500
    await agent.post("/sign-up").send(user.reqData)
    const response = await agent.post("/sign-up").send(user.reqData);

    expect(response.status).toBe(409);
  });
});

describe("POST /sign-up", () => {
  it("should not store the password", async () => {
    const user = await createUser({});
    await agent.post("/sign-up").send(user.reqData);
    const savedUser = await user.ormRepository.findOne({
      where: { email: user.reqData.email },
    });
    expect(savedUser.password).not.toBe(user.reqData.password);
  });
});
