import { Knex } from "knex";
import { ReservationData, TableData } from "../types/application";
import knex from "../db/connection";

/**
 * Creates a new reservation
 */
async function create(reservation: ReservationData): Promise<ReservationData> {
  try {
    // Validate the reservation data before insertion
    if (!reservation) {
      throw new Error("Reservation data is required");
    }

    // Format the date and time values for PostgreSQL
    const formattedReservation = {
      ...reservation,
      reservation_date: new Date(reservation.reservation_date).toISOString().split('T')[0],
      status: reservation.status || "booked",
    };

    // Log the formatted data for debugging
    console.log("Formatted reservation data:", formattedReservation);

    // Perform the insert within a transaction with explicit column selection
    const createdReservation = await knex.transaction(async (trx) => {
      const [created] = await trx("reservations")
        .insert({
          first_name: formattedReservation.first_name,
          last_name: formattedReservation.last_name,
          mobile_number: formattedReservation.mobile_number,
          reservation_date: formattedReservation.reservation_date,
          reservation_time: formattedReservation.reservation_time,
          people: formattedReservation.people,
          status: formattedReservation.status,
        })
        .returning([
          "reservation_id",
          "first_name",
          "last_name",
          "mobile_number",
          "reservation_date",
          "reservation_time",
          "people",
          "status",
          "created_at",
          "updated_at"
        ]);
      
      if (!created) {
        throw new Error("Failed to create reservation");
      }
      
      return created;
    });

    // Log the created reservation for debugging
    console.log("Created reservation:", createdReservation);

    return createdReservation;
  } catch (error) {
    console.error("Error creating reservation:", error);
    // Ensure we're throwing an Error object
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create reservation");
  }
}

/**
 * Lists reservations by date or mobile number
 */
function list(date?: string, mobile_number?: string): Promise<ReservationData[]> {
  if (mobile_number) {
    return search(mobile_number);
  }
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .andWhereNot({ status: "finished" })
    .orderBy("reservation_time");
}

/**
 * Reads a single reservation by ID
 */
function read(reservation_id: number): Promise<ReservationData> {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

/**
 * Seats a reservation at a table
 */
async function seat(reservation_id: number, table_id: number): Promise<ReservationData> {
  return knex.transaction(async (trx: Knex.Transaction) => {
    const reservation = await trx("reservations")
      .where({ reservation_id })
      .first();

    if (!reservation) {
      throw new Error("Reservation not found");
    }

    if (reservation.status === "seated") {
      throw new Error("Reservation is already seated");
    }

    await trx("tables")
      .where({ table_id })
      .update({ reservation_id })
      .returning("*");

    return reservation;
  });
}

/**
 * Updates the status of a reservation
 */
async function updateStatus(
  reservation_id: number,
  status: ReservationData["status"]
): Promise<ReservationData> {
  const updatedRecords = await knex("reservations")
    .where({ reservation_id })
    .update({ status })
    .returning("*");
  return updatedRecords[0];
}

/**
 * Finishes a reservation and clears the table
 */
async function finish(table_id: number): Promise<ReservationData[]> {
  return knex.transaction(async (trx: Knex.Transaction) => {
    const table = await trx("tables").where({ table_id }).first() as TableData;
    const reservation_id = table.reservation_id;

    if (!reservation_id) {
      throw new Error("No reservation to finish for this table");
    }

    await trx("tables").where({ table_id }).update({ reservation_id: null });

    return trx("reservations")
      .where({ reservation_id })
      .update({ status: "finished" })
      .returning("*");
  });
}

/**
 * Searches for reservations by mobile number
 */
function search(mobile_number: string): Promise<ReservationData[]> {
  return knex("reservations")
    .select("*")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

/**
 * Updates a reservation
 */
function update(
  reservation_id: number,
  updatedReservation: ReservationData
): Promise<ReservationData[]> {
  return knex("reservations")
    .where({ reservation_id })
    .update(updatedReservation, "*");
}

export const reservationsService = {
  create,
  list,
  read,
  seat,
  updateStatus,
  finish,
  search,
  update,
};
