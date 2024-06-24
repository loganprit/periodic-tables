const knex = require("../db/connection");

function create(table) {
  return knex("tables").insert(table).returning("*");
}

function list() {
  return knex("tables").select("*").orderBy("table_name");
}

async function seat(table_id, reservation_id) {
  return knex.transaction(async (trx) => {
    const table = await trx("tables").where({ table_id }).first();

    if (!table) {
      throw { status: 404, message: "Table not found" };
    }

    if (table.capacity < 1) {
      throw { status: 400, message: "Table capacity must be at least 1" };
    }

    if (table.reservation_id) {
      throw { status: 400, message: "Table is occupied" };
    }

    const reservation = await trx("reservations")
      .where({ reservation_id })
      .first();
    if (!reservation) {
      throw {
        status: 404,
        message: `Reservation ${reservation_id} does not exist`,
      };
    }

    if (table.capacity < reservation.people) {
      throw { status: 400, message: "Table does not have sufficient capacity" };
    }

    if (reservation.status === "seated") {
      throw { status: 400, message: "Reservation is already seated" };
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

function read(table_id) {
  return knex("tables").select("*").where({ table_id }).first();
}

function finish(table_id) {
  return knex.transaction(async (trx) => {
    const table = await trx("tables").where({ table_id }).first();

    const reservation_id = table.reservation_id;

    if (!reservation_id) {
      throw new Error("No reservation to finish for this table");
    }

    await trx("tables").where({ table_id }).update({ reservation_id: null });

    await trx("reservations")
      .where({ reservation_id })
      .update({ status: "finished" });

    return trx("tables").where({ table_id }).first();
  });
}

module.exports = {
  create,
  list,
  seat,
  read,
  finish,
};
