const knex = require("../db/connection");

function create(reservation) {
  console.log("Creating reservation in database:", reservation);
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((createdRecords) => {
      console.log("Reservation created:", createdRecords);
      return createdRecords;
    })
    .catch((error) => {
      console.error("Error creating reservation:", error);
      throw error;
    });
}

function list(date) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: date })
    .orderBy("reservation_time");
}

module.exports = {
  create,
  list,
};
