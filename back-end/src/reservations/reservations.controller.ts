import { NextFunction } from "express";
import { CustomRequest, CustomResponse, ReservationData } from "../types/application";
import { APIError } from "../types/errors";
import { reservationsService as service } from "./reservations.service";
import asyncErrorBoundary from "../errors/asyncErrorBoundary";
import {
  isValidDate,
  isValidTime,
  validateReservationDate,
} from "../utils/dateValidation";
import { validateReservationTime } from "../utils/timeValidation";

/**
 * Validates that the request body contains all required fields
 */
async function hasRequiredFields(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { data } = req.body;

  if (!data) {
    next({
      status: 400,
      message: "Request body must include data object",
    } as APIError);
    return;
  }

  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];

  for (const field of requiredFields) {
    if (!data[field]) {
      next({
        status: 400,
        message: `Field '${field}' is required`,
      } as APIError);
      return;
    }
  }

  next();
}

/**
 * Validates the status of a new reservation
 */
async function validateStatus(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { data } = req.body;
  
  if (!data) return next();
  
  const status = data.status || "booked";
  const validStatuses = ["booked", "seated", "finished", "cancelled"];
  
  if (!validStatuses.includes(status)) {
    return next({
      status: 400,
      message: `Invalid status: ${status}`,
    } as APIError);
  }

  if (status !== "booked") {
    return next({
      status: 400,
      message: "New reservations must have a status of 'booked'",
    } as APIError);
  }

  next();
}

/**
 * Creates a new reservation
 */
async function create(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  try {
    const { data } = req.body;
    const createdReservation = await service.create(data);
    res.status(201).json({ data: createdReservation });
  } catch (error) {
    console.error("Error in create controller:", error);
    next(error);
  }
}

/**
 * Get a list of reservations
 */
async function list(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { date, mobile_number } = req.query as {
    date?: string;
    mobile_number?: string;
  };

  try {
    const data = await service.list(date, mobile_number);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a single reservation by ID
 */
async function read(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { reservation_id } = req.params;

  try {
    const data = await service.read(Number(reservation_id));
    if (data) {
      res.status(200).json({ data });
    } else {
      next({
        status: 404,
        message: `Reservation ${reservation_id} not found`,
      } as APIError);
    }
  } catch (error) {
    next(error);
  }
}

/**
 * Seat a reservation at a table
 */
async function seat(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { reservation_id } = req.params;
  const { table_id } = req.body.data as { table_id: number };

  try {
    const data = await service.seat(Number(reservation_id), table_id);
    res.json({ data });
  } catch (error) {
    next({ status: 400, message: error instanceof Error ? error.message : "Unknown error" } as APIError);
  }
}

/**
 * Update the status of a reservation
 */
async function updateStatus(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { reservation_id } = req.params;
  const { status } = req.body.data as { status: ReservationData["status"] };

  if (!status || !["booked", "seated", "finished", "cancelled"].includes(status)) {
    next({ status: 400, message: `Status ${status} is not valid` } as APIError);
    return;
  }

  try {
    const currentReservation = await service.read(Number(reservation_id));
    if (!currentReservation) {
      next({
        status: 404,
        message: `Reservation ${reservation_id} not found`,
      } as APIError);
      return;
    }

    if (currentReservation.status === "finished") {
      next({
        status: 400,
        message: "A finished reservation cannot be updated",
      } as APIError);
      return;
    }

    const updatedData = await service.updateStatus(Number(reservation_id), status);
    res.json({ data: updatedData });
  } catch (error) {
    next(error);
  }
}

/**
 * Finish a reservation at a table
 */
async function finish(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { table_id } = req.params;

  try {
    const data = await service.finish(Number(table_id));
    res.json({ data: data[0] });
  } catch (error) {
    next({ 
      status: 400, 
      message: error instanceof Error ? error.message : "Unknown error" 
    } as APIError);
  }
}

/**
 * Update a reservation
 */
async function update(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { reservation_id } = req.params;
  const { data } = req.body as { data: ReservationData };

  try {
    const currentReservation = await service.read(Number(reservation_id));
    if (!currentReservation) {
      next({
        status: 404,
        message: `Reservation ${reservation_id} not found`,
      } as APIError);
      return;
    }

    if (currentReservation.status !== "booked") {
      next({
        status: 400,
        message: "Only booked reservations can be edited",
      } as APIError);
      return;
    }

    const updatedReservation = { ...currentReservation, ...data };
    const updatedData = await service.update(
      Number(reservation_id),
      updatedReservation
    );
    res.json({ data: updatedData[0] });
  } catch (error) {
    next(error);
  }
}

/**
 * Validates the reservation date and time
 */
async function validateDateTime(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { reservation_date, reservation_time } = req.body.data;

  if (!isValidDate(reservation_date)) {
    return next({
      status: 400,
      message: "Invalid reservation_date format. Use YYYY-MM-DD",
    } as APIError);
  }

  if (!isValidTime(reservation_time)) {
    return next({
      status: 400,
      message: "Invalid reservation_time format. Use HH:MM (24-hour)",
    } as APIError);
  }

  const dateError = validateReservationDate(reservation_date);
  if (dateError) {
    return next({
      status: 400,
      message: dateError,
    } as APIError);
  }

  const timeError = validateReservationTime(reservation_date, reservation_time);
  if (timeError) {
    return next({
      status: 400,
      message: timeError,
    } as APIError);
  }

  next();
}

export const reservationsController = {
  create: [
    asyncErrorBoundary(hasRequiredFields),
    asyncErrorBoundary(validateDateTime),
    asyncErrorBoundary(validateStatus),
    asyncErrorBoundary(create),
  ],
  list: asyncErrorBoundary(list),
  read: asyncErrorBoundary(read),
  seat: asyncErrorBoundary(seat),
  updateStatus: asyncErrorBoundary(updateStatus),
  finish: asyncErrorBoundary(finish),
  update: [
    asyncErrorBoundary(hasRequiredFields),
    asyncErrorBoundary(validateDateTime),
    asyncErrorBoundary(update)
  ],
};
