import { Knex, knex } from "knex";
import config from "../../knexfile";

/**
 * Type definition for supported environment names
 * Using a union type ensures only valid environments can be used
 */
type Environment = "development" | "test" | "production" | "preview";

/**
 * Type definition for environment configuration structure
 * Extends Knex.Config to ensure proper typing of configuration options
 */
interface EnvironmentConfig extends Record<Environment, Knex.Config> {
    [key: string]: Knex.Config;
}

/**
 * Validates that the environment is one of our supported types
 * @param env - Environment string to validate
 * @returns The validated environment string
 * @throws Error if environment is invalid or undefined
 */
function validateEnvironment(env: string | undefined): Environment {
    if (!env) {
        throw new Error("NODE_ENV environment variable is not defined");
    }

    const validEnvironments: readonly Environment[] = [
        "development",
        "test",
        "production",
        "preview"
    ] as const;
    
    if (!validEnvironments.includes(env as Environment)) {
        throw new Error(
            `Invalid environment: ${env}. Must be one of: ${validEnvironments.join(", ")}`
        );
    }
    
    return env as Environment;
}

/**
 * Get and validate the current environment
 * Default to development if NODE_ENV is not set
 */
const environment = validateEnvironment(process.env.NODE_ENV ?? "development");

/**
 * Type assert and validate the configuration
 * @throws Error if configuration is invalid
 */
function validateConfig(config: unknown): EnvironmentConfig {
    if (!config || typeof config !== "object") {
        throw new Error("Invalid configuration object");
    }

    const typedConfig = config as EnvironmentConfig;
    
    if (!typedConfig[environment]) {
        throw new Error(`Configuration for environment '${environment}' not found`);
    }

    return typedConfig;
}

const typedConfig = validateConfig(config);

/**
 * Database connection instance
 * Using Knex.js with environment-specific configuration
 */
const db: Knex = knex(typedConfig[environment]);

export default db;