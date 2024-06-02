const knex = require("../db/connection");

function create(reservation) {
  console.log("Inserting reservation:", reservation);
  return knex("reservations").insert(reservation).returning("*");
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
