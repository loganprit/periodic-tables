const knex = require("../db/connection");

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => createdRecords[0]);
}

function list(date, mobile_number) {
  if (mobile_number) {
    return search(mobile_number);
  }
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .whereNotExists(knex("reservations").where({ status: "finished" }))
    .orderBy("reservation_time");
}

function read(reservation_id) {
  return knex("reservations").select("*").where({ reservation_id }).first();
}

function seat(reservation_id, table_id) {
  return knex.transaction(async (trx) => {
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

    return trx("reservations")
      .where({ reservation_id })
      .update({ status: "seated" })
      .returning("*");
  });
}

function updateStatus(reservation_id, status) {
  return knex("reservations")
    .where({ reservation_id })
    .update({ status })
    .returning("*")
    .then((updatedRecords) => updatedRecords[0]);
}

function finish(table_id) {
  return knex.transaction(async (trx) => {
    const table = await trx("tables").where({ table_id }).first();

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

function search(mobile_number) {
  return knex("reservations")
    .select("*")
    .whereRaw(
      "translate(mobile_number, '() -', '') like ?",
      `%${mobile_number.replace(/\D/g, "")}%`
    )
    .orderBy("reservation_date");
}

function update(reservation_id, updatedReservation) {
  return knex("reservations")
    .where({ reservation_id })
    .update(updatedReservation, "*");
}

module.exports = {
  create,
  list,
  read,
  seat,
  updateStatus,
  finish,
  search,
  update,
};
