import { Router } from "express";
import { tablesController } from "./tables.controller";

/**
 * Router for handling table-related endpoints
 */
const router: Router = Router();

// Base routes for tables
router.route("/").get(tablesController.list).post(tablesController.create);

// Routes for specific table operations
router.route("/:table_id/seat").put(tablesController.seat);

// Route for finishing a table reservation
router.route("/:table_id/seat").put(tablesController.seat).delete(tablesController.finish);

export default router;
