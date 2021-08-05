import axios from "axios";
import { writeFileSync } from "fs";

interface LooseObject {
  [key: string]: any;
}

const BASE_URL = "https://pokeapi.co/api/v2/";

async function getAllPokemons() {
  let getNext = true;
  let id = 1;
  const pokemons: any[] = [];
  while (getNext) {
    const url = new URL(`pokemon/${id}`, BASE_URL).toString();
    console.log(url);
    let pokemon: LooseObject = {};
    await axios
      .get(url)
      .then(({ data }) => {
        pokemon = data;
        return axios.get(data.species.url);
      })
      .then(({ data }) => {
        pokemon.species = data;
        pokemons.push(pokemon);
        id++;
      })
      .catch((err) => {
        getNext = false;
        console.log(err);
      });
  }
  return pokemons;
}

getAllPokemons().then((data) => {
  writeFileSync("./pokemons.json", JSON.stringify(data));
  process.exit();
});

process.stdin.resume();
