const pg = require("pg");
const dotenv = require("dotenv");
const fs = require("fs");
const database = require("./pgDatabase");

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

console.log(pokemons.length);

(async () => {
  await database.clear();
  
  for (const pokemon of pokemons) {
    const { name, number, image, weight, height, baseExp, description } =
      pokemon;

    const text = description
    .split("\n")
    .map((line:string) => line.trim())
    .join(" ");

    let fDescription = text.replace(/\f/m," ");
    fDescription = fDescription.replace(/\\f/m," ");

    const params = [name, number, image, weight, height, baseExp, fDescription];
    await connection.query(
      `
      INSERT INTO pokemons
      (name, number, image, weight, height, "baseExp", description)
      VALUES
      ($1, $2, $3, $4, $5, $6, $7)
    `,
      params
    );
    console.log(params);
  }
})();
