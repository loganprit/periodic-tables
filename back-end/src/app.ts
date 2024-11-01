import path from "path";
import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";
import { AppConfig } from "./types/config";
import { CustomRequest, CustomResponse } from "./types/application";

import errorHandler from "./errors/errorHandler";
import notFound from "./errors/notFound";
import { reservationsRouter } from "./reservations/reservations.router";
import { tablesRouter } from "./tables/tables.router";

// Configure environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

// Create Express application
const app: Application = express();

// Configure application settings
const config: AppConfig = {
  port: parseInt(process.env.PORT, 10) || 5000,
  environment: process.env.NODE_ENV || "development",
  database: {
    client: "postgresql",
    connection: {
      connectionString: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false,
      },
    },
    pool: {
      min: 0,
      max: 5,
    },
    migrations: {
      directory: "./db/migrations",
    },
    seeds: {
      directory: "./db/seeds",
    },
    debug: process.env.DEBUG === "true",
  },
  cors: {
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  },
};

// Configure CORS middleware with type-safe options from config
app.use(cors(config.cors));

// Parse JSON request bodies
app.use(express.json());

// Mount routers
app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export { app as default, config };
