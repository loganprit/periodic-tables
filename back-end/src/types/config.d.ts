import { Knex } from "knex";

/**
 * Database configuration interface
 */
export interface DatabaseConfig {
  client: string;
  connection: {
    connectionString: string;
    ssl: {
      rejectUnauthorized: boolean;
    };
  };
  pool: {
    min: number;
    max: number;
  };
  migrations: {
    directory: string;
  };
  seeds: {
    directory: string;
  };
  debug: boolean;
}

/**
 * Environment configuration interface
 */
export interface EnvironmentConfig {
  development: Knex.Config;
  test: Knex.Config;
  preview: Knex.Config;
  production: Knex.Config;
}

/**
 * Application configuration interface
 */
export interface AppConfig {
  port: number;
  environment: string;
  database: DatabaseConfig;
  cors: {
    origin: string;
    methods: string[];
    allowedHeaders: string[];
  };
}
