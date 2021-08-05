import { getConnection } from "typeorm";
import { createUser } from "../factories/userFactory";

export async function reset() {
  const connection = getConnection();

  await connection.query(`DELETE FROM "users_pokemons_pokemons"`);
  await connection.query(`DELETE FROM sessions`);
  await connection.query(`DELETE FROM users`);

  await connection.query(`ALTER SEQUENCE "sessions_id_seq" RESTART WITH 1`);
  await connection.query(`ALTER SEQUENCE "users_id_seq" RESTART WITH 1`);

  for(let i=0; i<5; i++){
    const user = await createUser({});
    await user.saveToDatabase();
  }
}

