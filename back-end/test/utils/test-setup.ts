import knex from "../../src/db/connection";

export async function resetDatabase(): Promise<void> {
  try {
    await knex.migrate.forceFreeMigrationsLock();
    await knex.migrate.rollback(undefined, true);
    await knex.migrate.latest();
  } catch (error) {
    console.error("Database reset failed:", error);
    throw error;
  }
}

export async function seedDatabase(): Promise<void> {
  try {
    await knex.transaction(async (trx) => {
      await trx.seed.run();
    });
  } catch (error) {
    console.error("Database seed failed:", error);
    throw error;
  }
}

export async function cleanupDatabase(): Promise<void> {
  try {
    await knex.migrate.rollback(undefined, true);
    await knex.destroy();
  } catch (error) {
    console.error("Database cleanup failed:", error);
    throw error;
  }
}
