const reservations = require("./00-reservations.json");

exports.seed = function (knex) {
  return knex("reservations")
    .del()
    .then(() =>
      knex.raw("TRUNCATE TABLE reservations RESTART IDENTITY CASCADE")
    )
    .then(() => knex("reservations").insert(reservations));
};
