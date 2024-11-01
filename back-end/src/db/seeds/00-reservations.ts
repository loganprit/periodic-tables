import { Knex } from "knex";
import * as fs from "fs";
import * as path from "path";

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
 * Read and parse the JSON seed data
 */
const seedData: string = fs.readFileSync(
  path.join(__dirname, "./00-reservations.json"),
  "utf8"
);
const reservations: Reservation[] = JSON.parse(seedData);

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
