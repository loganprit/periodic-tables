const { TextEncoder, TextDecoder } = require("util");
const knex = require("../src/db/connection");

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

beforeAll(() => {
  return knex.migrate
    .forceFreeMigrationsLock()
    .then(() => knex.migrate.rollback(null, true))
    .then(() => knex.migrate.latest());
});

afterAll(async () => {
  try {
    await knex.destroy();
  } catch (error) {
    console.error("Failed to destroy knex connection:", error);
  }
});
