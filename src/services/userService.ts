import { getRepository } from "typeorm";
import bcrypt from "bcrypt";

import User from "../entities/User";
import UserCreate from "../protocols/UserCreate";
import { DeepValidationError } from "../protocols/DeepValidationError";

const emails: { [key: string]: boolean } = {};

export async function loadEmails() {
  const userList = await getRepository(User).find({ select: ["email"] });
  userList.forEach((user) => (emails[user.email] = true));
}

export async function create(user: UserCreate) {
  if (emails[user.email])
    throw new DeepValidationError(409, "email is already in use");

  try {
    emails[user.email] = true;
    const hashedPassword = bcrypt.hashSync(user.password, 10);
    const safeUser = getRepository(User).create({email:user.email, password:hashedPassword});
    await getRepository(User).save(safeUser);
  } catch (err){
    delete emails[user.email];
    throw err;
  }
}
