# Sing Me A Song API

Pokedex is a web api built to serve the website listed in the live demo. It's job is to authenticate users and deliver information on pokemons and how these pokemons relate to the current user. The front end side of this application can be found here [link](https://github.com/vitorelourenco/pokedex-react)

## Live Demo
[link](https://pokedex-rose-six.vercel.app/)
Heroku will put the node server to sleep after a while so you'll have to wait a bit to get a response for your first request.

## Routes 
- https://vel-pokedex.herokuapp.com

- GET /pokemons

- POST /sign-up </br>
- POST /sign-in </br>
- POST /my-pokemons/$ID/add </br>
- POST /my-pokemons/$ID/remove </br>


## Visual Database Structure
[link](https://imgur.com/a/goSDjLP)

## Built With

- NodeJS , ExpressJS , JavaScript , TypeScript , TypeORM , PostgreSQL
- Linux

## Tested With

- Jest, Supertest

## Instalation
- Install NodeJS, nvm and git
- $ git clone https://github.com/vitorelourenco/pokedex-api.git
- $ npm i
- Create your psql dev database, there's a dump at /dump_database_example.sql (there's no sensitive information there)
- Create your psql test database
- Create your .env and .env.test files (there are examples at /.env.example )

## Test
- $ npm run test 

## Run Dev Environment
- $ npm run dev

## Build
- $ npm run build

## Dependencies
- All dependencies are listed in the package.json file.

## Deploy
- You can deploy this project on heroku like I did. There are plenty of tutorials online and it's free.

## Author

👤 **Vitor Emanuel Lourenco**

- GitHub: [@vitorelourenco](https://github.com/vitorelourenco)
- Twitter: [@Vitorel](https://twitter.com/Vitorel)
- LinkedIn: [vitoremanuellourenco](https://www.linkedin.com/in/vitoremanuellourenco/)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

Feel free to check the [issues page](https://github.com/vitorelourenco/pokedex-api/issues).

## Show your support

Give a ⭐️ if you like this project!

## Acknowledgments

- RespondeAi (https://www.respondeai.com.br/)