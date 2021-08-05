import axios from "axios";
import { writeFileSync } from "fs";

const BASE_URL = "https://pokeapi.co/api/v2/";

async function getAllPokemons() {
  let getNext = true;
  let id = 1;
  const pokemons: any[] = [];
  while (getNext) {
    const url = new URL(`${id}`, BASE_URL).toString();
    await axios
      .get(url)
      .then(({ data }) => {
        pokemons.push(data);
        id++;
      })
      .catch(() => (getNext = false));
  }
  return pokemons;
}

let quit = false;

getAllPokemons()
  .then((data) => {
    writeFileSync("./src/pokemons.json", JSON.stringify(data));
  })
  .finally(() => (quit = true));

while (!quit) {}
