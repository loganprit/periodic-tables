import { Knex, knex } from "knex";
import config from "../knexfile";

/**
 * Type definition for supported environment names
 * Using a union type ensures only valid environments can be used
 */
type Environment = "development" | "test" | "production" | "preview";

/**
 * Type definition for environment configuration structure
 * This helps TypeScript understand the shape of our config object
 */
interface EnvironmentConfig {
    [key: string]: Knex.Config;
}

/**
 * Validates that the environment is one of our supported types
 * @param env - Environment string to validate
 * @returns The validated environment string
 * @throws Error if environment is invalid
 */
function validateEnvironment(env: string): Environment {
    const validEnvironments: Environment[] = ["development", "test", "production", "preview"];
    
    if (!validEnvironments.includes(env as Environment)) {
        throw new Error(`Invalid environment: ${env}. Must be one of: ${validEnvironments.join(", ")}`);
    }
    
    return env as Environment;
}

// Get and validate the current environment
const environment = validateEnvironment(process.env.NODE_ENV || "development");

// Type assert the config to match our expected structure
const typedConfig = config as EnvironmentConfig;

// Ensure the environment exists in our config
if (!typedConfig[environment]) {
    throw new Error(`Configuration for environment '${environment}' not found`);
}

/**
 * Database connection instance
 * Using Knex.js with environment-specific configuration
 */
const db: Knex = knex(typedConfig[environment]);

export default db;