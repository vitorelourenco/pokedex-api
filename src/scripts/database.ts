const pg = require("pg");
const dotenv = require("dotenv");

dotenv.config();

const { Pool } = pg;

const pgConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const connection = new Pool(pgConfig);

export async function reset() {
  await connection.query(`DELETE FROM "users_pokemons_pokemons"`);
  await connection.query(`DELETE FROM sessions`);
  await connection.query(`DELETE FROM users`);

  await connection.query(`ALTER SEQUENCE "sessions_id_seq" RESTART WITH 1`);
  await connection.query(`ALTER SEQUENCE "users_id_seq" RESTART WITH 1`);
}
