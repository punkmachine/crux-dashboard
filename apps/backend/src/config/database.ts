import "reflect-metadata";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { DataSource } from "typeorm";
import { Site } from "../entities/Site.js";
import { Metric } from "../entities/Metric.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPaths = [
  join(__dirname, "../../.env"),
  join(__dirname, "../../../.env"),
  ".env",
];

for (const envPath of envPaths) {
  const result = config({ path: envPath });
  if (!result.error) {
    break;
  }
}

const dbHost = process.env.DB_HOST || "localhost";
const dbPort = parseInt(process.env.DB_PORT || "5432", 10);
const dbUsername = process.env.DB_USERNAME || "postgres";
const dbPassword = (process.env.DB_PASSWORD || "postgres").trim();
const dbDatabase = process.env.DB_DATABASE || "crux_dashboard";

const dbConfig = {
  type: "postgres" as const,
  host: dbHost,
  port: dbPort,
  username: dbUsername,
  password: dbPassword,
  database: dbDatabase,
  synchronize: process.env.TYPEORM_SYNCHRONIZE !== "false",
  logging: process.env.NODE_ENV === "development",
  entities: [Site, Metric],
  migrations: [],
  subscribers: [],
};

export const AppDataSource = new DataSource(dbConfig);
