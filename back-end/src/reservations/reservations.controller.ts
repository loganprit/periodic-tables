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
import { DateValidationError } from "../types/validation";

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
    return next(new APIError(400, "Request body must include data object"));
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
    if (!data[field] || (typeof data[field] === "string" && !data[field].trim())) {
      return next(new APIError(400, `Field '${field}' is required and cannot be empty`));
    }

    if (field === "reservation_date" && !isValidDate(data[field])) {
      return next(new APIError(400, "reservation_date must be a valid date"));
    }

    if (field === "reservation_time" && !isValidTime(data[field])) {
      return next(new APIError(400, "reservation_time must be a valid time"));
    }

    if (field === "people") {
      if (typeof data.people !== "number" || data.people < 1) {
        return next(new APIError(400, "people must be a number greater than 0"));
      }
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
    return next(new APIError(400, `Invalid status: ${status}`));
  }

  if (req.method === "POST" && status !== "booked") {
    return next(new APIError(400, `Status '${status}' is not valid for new reservations`));
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
    const filteredData = date 
      ? data.filter(reservation => reservation.status !== "finished")
      : data;
    res.json({ data: filteredData });
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
    const reservation = await service.read(Number(reservation_id));
    
    if (!reservation) {
      return next(new APIError(404, `Reservation ${reservation_id} not found`));
    }

    res.json({ data: reservation });
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
    return next(new APIError(400, `Status '${status}' is not valid`));
  }

  try {
    const currentReservation = await service.read(Number(reservation_id));
    
    if (!currentReservation) {
      return next(new APIError(404, `Reservation ${reservation_id} not found`));
    }

    if (currentReservation.status === "finished") {
      return next(new APIError(400, "A finished reservation cannot be updated"));
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
    // First check if reservation exists
    const currentReservation = await service.read(Number(reservation_id));
    
    if (!currentReservation) {
      throw new APIError(404, `Reservation ${reservation_id} not found`);
    }

    // Check if the reservation is finished
    if (currentReservation.status === "finished") {
      throw new APIError(400, "A finished reservation cannot be updated");
    }

    const updatedData = await service.update(Number(reservation_id), data);
    res.json({ data: updatedData[0] });
  } catch (error) {
    if (error instanceof APIError) {
      next(error);
    } else {
      next(new APIError(500, "An unexpected error occurred"));
    }
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
    return next(new APIError(400, DateValidationError.INVALID_DATE));
  }

  if (!isValidTime(reservation_time)) {
    return next(new APIError(400, DateValidationError.INVALID_TIME));
  }

  const dateError = validateReservationDate(reservation_date);
  if (dateError) {
    return next(new APIError(400, dateError));
  }

  const timeError = validateReservationTime(reservation_date, reservation_time);
  if (timeError) {
    return next(new APIError(400, timeError));
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
