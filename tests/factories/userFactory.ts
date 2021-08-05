import * as srcDatabase from '../../src/utils/database';
import faker from 'faker';
import User from "../../src/entities/User";
import { Instance } from "../../src/utils/database";

export async function createUser (params:{email?:string, password?:string, repeatPassword?:string}) {
  const salt = await srcDatabase.getSalt(User);
  const email = salt + (params?.email || faker.internet.email());
  const password = params?.password || faker.internet.password();
  const repeatPassword = params?.repeatPassword || password;

  const ormUser = {
    email,
    password
  }

  const reqUser = {
    email,
    password,
    repeatPassword
  }

  return new Instance(User, ormUser, reqUser);
}
