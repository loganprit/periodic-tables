import { Router } from "express";
import { reservationsController } from "./reservations.controller";

/**
 * Router for handling reservation-related endpoints
 */
const router: Router = Router();

// Base routes for reservations
router.route("/")
  .post(reservationsController.create)
  .get(reservationsController.list);

// Routes for specific reservation operations
router.route("/:reservation_id")
  .get(reservationsController.read)
  .put(reservationsController.update);

// Route for seating a reservation
router.route("/:reservation_id/seat")
  .put(reservationsController.seat);

// Route for updating reservation status
router.route("/:reservation_id/status")
  .put(reservationsController.updateStatus);

// Route for finishing a table reservation
router.route("/:table_id/seat")
  .delete(reservationsController.finish);

// Route for searching reservations
router.route("/search")
  .get(reservationsController.list);

export default router;
