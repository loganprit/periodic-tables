import path from "path";
import dotenv from "dotenv";
import { Knex } from "knex";

dotenv.config();

// Destructure directly from process.env
const {
  DATABASE_URL,
  DATABASE_URL_DEVELOPMENT,
  DATABASE_URL_TEST,
  DATABASE_URL_PREVIEW,
  DEBUG,
} = process.env;

/**
 * SSL configuration for database connections
 */
const ssl = { rejectUnauthorized: false };

/**
 * Base configuration shared across all environments
 */
const baseConfig: Partial<Knex.Config> = {
  client: "postgresql",
  pool: { min: 1, max: 5 },
  migrations: {
    directory: path.join(__dirname, "src", "db", "migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "src", "db", "seeds"),
  },
  debug: DEBUG === "true",
};

/**
 * Environment-specific database configurations
 */
const config: Record<string, Knex.Config> = {
  development: {
    ...baseConfig,
    connection: {
      connectionString: DATABASE_URL_DEVELOPMENT,
      ssl,
    },
  } as Knex.Config,
  test: {
    ...baseConfig,
    connection: {
      connectionString: DATABASE_URL_TEST,
      ssl,
    },
  } as Knex.Config,
  preview: {
    ...baseConfig,
    connection: {
      connectionString: DATABASE_URL_PREVIEW,
      ssl,
    },
  } as Knex.Config,
  production: {
    ...baseConfig,
    connection: {
      connectionString: DATABASE_URL,
      ssl,
    },
  } as Knex.Config,
};

export default config;
