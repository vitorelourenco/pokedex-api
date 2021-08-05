const pg = require("pg");
const dotenv = require("dotenv");
const fs = require("fs");
const database = require("./database");

dotenv.config();

const { Pool } = pg;

const pgConfig = {
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false,
  },
};

const connection = new Pool(pgConfig);
console.log("dir ", __dirname);
const pokemons = JSON.parse(
  fs.readFileSync("./parsedPokemons.json").toString()
);

(async () => {
  await database.reset();
  for (const pokemon of pokemons) {
    const { name, number, image, weight, height, baseExp, description } =
      pokemon;
    const params = [name, number, image, weight, height, baseExp, description];
    await connection.query(
      `
      INSERT INTO pokemons
      (name, number, image, weight, height, "baseExp", description)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `,
      params
    );
  }
})();
