import path from "path";
import { Knex } from "knex";
import knex from "../src/db/connection";
import { config } from "dotenv";

// Load environment variables from .env file
config({ path: path.join(__dirname, "..", ".env") });

/**
 * Drops and reseeds the database
 * 1. Forces release of any existing migration locks
 * 2. Rolls back all migrations
 * 3. Runs all migrations
 * 4. Runs all seeds
 * 5. Closes database connection
 * @returns {Promise<void>}
 */
async function dropAndReseedDatabase(): Promise<void> {
  try {
    await knex.migrate.forceFreeMigrationsLock();
    await knex.migrate.rollback(undefined, true);
    await knex.migrate.latest();
    await knex.seed.run();
    console.log("Successfully dropped and seeded database");
  } catch (error) {
    console.error("Failed to drop and seed database:", error);
    throw error;
  } finally {
    await knex.destroy();
  }
}

// Execute the database reset
dropAndReseedDatabase().catch((error: Error) => {
  console.error("Fatal error during database operations:", error);
  process.exit(1);
});
