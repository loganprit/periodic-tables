const path = require("path");
require("dotenv").config();

const {
  DATABASE_URL,
  DATABASE_URL_DEVELOPMENT,
  DATABASE_URL_TEST,
  DATABASE_URL_PREVIEW,
  DEBUG,
} = process.env;

const ssl = { rejectUnauthorized: false };

const baseConfig = {
  client: "postgresql",
  pool: { min: 1, max: 5 },
  migrations: {
    directory: path.join(__dirname, "src", "db", "migrations"),
  },
  seeds: {
    directory: path.join(__dirname, "src", "db", "seeds"),
  },
  debug: !!DEBUG,
};

const config = {
  development: {
    ...baseConfig,
    connection: {
      connectionString: DATABASE_URL_DEVELOPMENT,
      ssl,
    },
  },
  test: {
    ...baseConfig,
    connection: {
      connectionString: DATABASE_URL_TEST,
      ssl,
    },
  },
  preview: {
    ...baseConfig,
    connection: {
      connectionString: DATABASE_URL_PREVIEW,
      ssl,
    },
  },
  production: {
    ...baseConfig,
    connection: {
      connectionString: DATABASE_URL,
      ssl,
    },
  },
};

module.exports = config;
