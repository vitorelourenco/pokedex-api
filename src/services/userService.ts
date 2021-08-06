import { getRepository } from "typeorm";
import bcrypt from "bcrypt";

import User from "../entities/User";
import UserCreate from "../protocols/UserCreate";
import { DeepValidationError } from "../protocols/DeepValidationError";
import ReqAuthenticate from "../protocols/ReqAuthenticate";
import Session from "../entities/Session";
import jwt from "jsonwebtoken";

const emailsTable: { [key: string]: boolean } = {};

export async function loadEmails() {
  const userList = await getRepository(User).find({ select: ["email"] });
  userList.forEach((user) => (emailsTable[user.email] = true));
}

export async function create(user: UserCreate) {
  if (emailsTable[user.email])
    throw new DeepValidationError(409, "email is already in use");

  try {
    emailsTable[user.email] = true;
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const safeUser = getRepository(User).create({
      email: user.email,
      password: hashedPassword,
    });
    await getRepository(User).save(safeUser);
  } catch (err) {
    delete emailsTable[user.email];
    throw err;
  }
}

export async function authenticate(user: ReqAuthenticate) {
  const { email, password } = user;

  const dbUser = await getRepository(User).findOne({ where: { email } });
  if (!dbUser) throw new DeepValidationError(401, "unauthorized credentials");

  const isCorrectPassword = bcrypt.compareSync(password, dbUser.password);
  if (!isCorrectPassword)
    throw new DeepValidationError(401, "unauthorized credentials");

  const session = getRepository(Session).create({ user: dbUser });
  await getRepository(Session).save(session);
  
  const key = process.env.JWT_SECRET;
  const token = jwt.sign({ sessionId: session.id }, key);

  return { token };
}
