import * as srcDatabase from '../../src/utils/database';
import faker from 'faker';
import User from "../../src/entities/User";
import { Instance } from "../../src/utils/database";
import bcrypt from 'bcrypt';

export async function createUser (params:{email?:string, password?:string, confirmPassword?:string}) {
  const salt = await srcDatabase.getSalt(User);
  const email = salt + (params?.email ?? faker.internet.email());
  const password = params?.password ?? faker.internet.password();
  const confirmPassword = params?.confirmPassword || password;

  const ormUser = {
    email,
    password: bcrypt.hashSync(password, 10)
  }

  const reqUser = {
    email,
    password,
    confirmPassword
  }

  return new Instance(User, ormUser, reqUser);
}
