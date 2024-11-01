import { Knex } from "knex";

/**
 * Interface representing a reservation record
 */
interface Reservation {
  first_name: string;
  last_name: string;
  mobile_number: string;
  reservation_date: string;
  reservation_time: string;
  people: number;
  created_at: string;
  updated_at: string;
}

/**
 * Import seed data from JSON file
 * Using require for JSON import as it's more reliable with CommonJS modules
 */
const reservations: Reservation[] = require("./00-reservations.json");

/**
 * Seed function to populate the reservations table
 * @param knex - Knex instance
 * @returns Promise that resolves when seeding is complete
 */
export async function seed(knex: Knex): Promise<void> {
  // Delete existing entries and reset identity
  await knex("reservations").del();
  await knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE");
  
  // Insert seed data
  await knex("reservations").insert(reservations);
}
