import { Knex } from "knex";

/**
 * Interface representing a table record
 */
interface Table {
  table_name: string;
  capacity: number;
}

/**
 * Seed function to populate the tables table
 * @param knex - Knex instance
 * @returns Promise that resolves when seeding is complete
 */
export async function seed(knex: Knex): Promise<void>{
  // Delete existing entries and reset identity
  await knex("tables").del();
  await knex.raw("TRUNCATE TABLE tables RESTART IDENTITY CASCADE");

  // Insert seed data
  await knex("tables").insert([
    { table_name: "#1", capacity: 6 },
    { table_name: "#2", capacity: 6 },
    { table_name: "Bar #1", capacity: 1 },
    { table_name: "Bar #2", capacity: 1 },
  ]);
}