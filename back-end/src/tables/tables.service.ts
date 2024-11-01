import { Knex } from "knex";
import { TableData, ReservationData } from "../types/application";
import { APIError } from "../types/errors";
import knex from "../db/connection";

/**
 * Creates a new table in the database
 * @param table - The table data to insert
 * @returns Promise resolving to the created table
 */
function create(table: Omit<TableData, "table_id">): Promise<TableData[]> {
  return knex("tables").insert(table).returning("*");
}

/**
 * Retrieves all tables from the database
 * @returns Promise resolving to array of tables
 */
function list(): Promise<TableData[]> {
  return knex("tables").select("*").orderBy("table_name");
}

/**
 * Assigns a reservation to a table
 * @param table_id - The ID of the table
 * @param reservation_id - The ID of the reservation
 * @returns Promise resolving to the updated table
 */
async function seat(
  table_id: number,
  reservation_id: number
): Promise<TableData> {
  return knex.transaction(async (trx: Knex.Transaction) => {
    const table = await trx("tables").where({ table_id }).first();

    if (!table) {
      throw new APIError(404, "Table not found");
    }

    if (table.capacity < 1) {
      throw new APIError(400, "Table capacity must be at least 1");
    }

    if (table.reservation_id) {
      throw new APIError(400, "Table is occupied");
    }

    const reservation: ReservationData = await trx("reservations")
      .where({ reservation_id })
      .first();

    if (!reservation) {
      throw new APIError(404, `Reservation ${reservation_id} does not exist`);
    }

    if (table.capacity < reservation.people) {
      throw new APIError(400, "Table does not have sufficient capacity");
    }

    if (reservation.status === "seated") {
      throw new APIError(400, "Reservation is already seated");
    }

    // Update table with reservation_id
    await trx("tables").where({ table_id }).update({ reservation_id });

    // Update reservation status to seated
    await trx("reservations")
      .where({ reservation_id })
      .update({ status: "seated" });

    return { ...table, reservation_id };
  });
}

/**
 * Retrieves a specific table by ID
 * @param table_id - The ID of the table to retrieve
 * @returns Promise resolving to the table data
 */
function read(table_id: number): Promise<TableData> {
  return knex("tables").select("*").where({ table_id }).first();
}

/**
 * Marks a table as finished and updates the reservation status
 * @param table_id - The ID of the table to finish
 * @returns Promise resolving to the updated table
 */
async function finish(table_id: number): Promise<TableData> {
  return knex.transaction(async (trx: Knex.Transaction) => {
    const table: TableData = await trx("tables").where({ table_id }).first();

    const reservation_id = table.reservation_id;

    if (!reservation_id) {
      throw new APIError(400, "No reservation to finish for this table");
    }

    await trx("tables").where({ table_id }).update({ reservation_id: null });

    await trx("reservations")
      .where({ reservation_id })
      .update({ status: "finished" });

    return trx("tables").where({ table_id }).first();
  });
}

export const tablesService = {
  create,
  list,
  seat,
  read,
  finish,
};
