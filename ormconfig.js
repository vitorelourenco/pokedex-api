import dotenv from "dotenv";

dotenv.config();

export const type = "postgres";
export const url = process.env.DATABASE_URL;
export const migrationsTableName = "migrations";
export const entities = ["dist/entities/*.js"];
export const migrations = ["dist/migrations/*.js"];
export const cli = {
  migrationsDir: "src/migrations",
  entitiesDir: "dist/entities/*.js",
};
