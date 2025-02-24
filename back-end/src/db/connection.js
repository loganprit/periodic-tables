const environment = process.env.NODE_ENV || "development";
const config = require("../../knexfile")[environment];

let knexInstance = null;

function createKnexInstance() {
  if (!knexInstance) {
    knexInstance = require("knex")(config);
  }
  return knexInstance;
}

module.exports = createKnexInstance();
