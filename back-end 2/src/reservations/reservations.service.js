const knex = require("../db/connection");

function create(reservation) {
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
