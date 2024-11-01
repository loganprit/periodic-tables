import path from "path";
import dotenv from "dotenv";
import express, { Application } from "express";
import cors from "cors";

import { errorHandler } from "./errors/errorHandler";
import { notFound } from "./errors/notFound";
import { reservationsRouter } from "./reservations/reservations.router";
import { tablesRouter } from "./tables/tables.router";

// Configure environment variables
dotenv.config({ path: path.join(__dirname, "..", ".env") });

const app: Application = express();

// Configure CORS middleware with type-safe options
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Parse JSON request bodies
app.use(express.json());

// Mount routers
app.use("/reservations", reservationsRouter);
app.use("/tables", tablesRouter);

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

export default app;
