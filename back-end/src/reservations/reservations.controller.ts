import { NextFunction } from "express";
import { CustomRequest, CustomResponse, ReservationData } from "../types/application";
import { APIError } from "../types/errors";
import * as service from "./reservations.service";
import asyncErrorBoundary from "../errors/asyncErrorBoundary";
import {
  isValidDate,
  isValidTime,
  validateReservationDate,
} from "../utils/dateValidation";
import { validateReservationTime } from "../utils/timeValidation";

/**
 * Middleware function to validate reservation data
 */
function validateReservationData(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): void {
  const { data = {} } = req.body as { data: Partial<ReservationData> };
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ] as const;

  for (const field of requiredFields) {
    if (!data[field]) {
      next({
        status: 400,
        message: `Reservation must include a ${field}`,
      } as APIError);
      return;
    }
  }

  if (
    typeof data.people !== "number" ||
    Number.isNaN(data.people) ||
    data.people < 1
  ) {
    next({
      status: 400,
      message: "Reservation must include a valid number of people",
    } as APIError);
    return;
  }

  if (!isValidDate(data.reservation_date)) {
    next({
      status: 400,
      message: "Reservation must include a valid reservation_date",
    } as APIError);
    return;
  }

  if (!isValidTime(data.reservation_time)) {
    next({
      status: 400,
      message: "Reservation must include a valid reservation_time",
    } as APIError);
    return;
  }

  const dateValidationError = validateReservationDate(data.reservation_date);
  if (dateValidationError) {
    next({
      status: 400,
      message: dateValidationError,
    } as APIError);
    return;
  }

  const timeValidationError = validateReservationTime(
    data.reservation_date,
    data.reservation_time
  );
  if (timeValidationError) {
    next({
      status: 400,
      message: timeValidationError,
    } as APIError);
    return;
  }

  next();
}

/**
 * Create a new reservation
 */
async function create(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { data } = req.body as { data: ReservationData };
  if (data.status && data.status !== "booked") {
    next({
      status: 400,
      message: `Status ${data.status} is not valid for new reservations`,
    } as APIError);
    return;
  }

  try {
    const newData: ReservationData = { ...data, status: "booked" };
    const createdData = await service.create(newData);
    res.status(201).json({ data: createdData });
  } catch (error) {
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

export const reservationsController = {
  create: [validateReservationData, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  read: asyncErrorBoundary(read),
  seat: asyncErrorBoundary(seat),
  updateStatus: asyncErrorBoundary(updateStatus),
  finish: asyncErrorBoundary(finish),
  update: [validateReservationData, asyncErrorBoundary(update)],
};
