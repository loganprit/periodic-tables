const reservations = require("./00-reservations.json");

exports.seed = function (knex) {
  return knex("reservations")
    .del()
    .then(function () {
      return knex("reservations").insert(reservations);
    });
};
