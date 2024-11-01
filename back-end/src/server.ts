import { config } from "dotenv";
import type { Knex } from "knex";
import app from "./app";
import knexInstance from "./db/connection";

// Load environment variables
config();

const PORT: number = Number(process.env.PORT) || 5001;

/**
 * Server startup function that initializes database and starts listening
 * @throws {Error} If database migration or server startup fails
 */
async function startServer(): Promise<void> {
  try {
    const migrations: readonly Knex.Migration[] = await knexInstance.migrate.latest();
    console.log("Database migrations completed:", migrations);
    
    app.listen(PORT, () => {
      console.log(`Server is listening on Port ${PORT}!`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    await knexInstance.destroy();
    process.exit(1);
  }
}

// Initialize server
startServer();
