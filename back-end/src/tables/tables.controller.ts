import { NextFunction } from "express";
import { CustomRequest, CustomResponse } from "../types/application";
import { TableData } from "../types/application";
import { APIError } from "../types/errors";
import { tablesService as service } from "./tables.service";
import asyncErrorBoundary from "../errors/asyncErrorBoundary";

type TableDataWithoutId = Omit<TableData, "table_id">;

/**
 * Middleware to validate table data
 */
async function validateTableData(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { data } = req.body;

  if (!data) {
    throw new APIError(400, "Data is required");
  }

  if (!data.table_name || data.table_name.length < 2) {
    throw new APIError(400, "table_name must be at least 2 characters");
  }

  if (!data.capacity || typeof data.capacity !== "number" || data.capacity < 1) {
    throw new APIError(400, "capacity must be a number greater than 0");
  }

  res.locals.table = data as TableDataWithoutId;
  next();
}

/**
 * Create a new table
 */
async function create(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  if (!res.locals.table) {
    throw new APIError(400, "Table data is required");
  }
  const data = await service.create(res.locals.table);
  res.status(201).json({ data: data[0] });
}

/**
 * Get a list of tables
 */
async function list(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const data = await service.list();
  res.json({ data });
}

/**
 * Validate reservation seating data
 */
async function validateSeat(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { data } = req.body;
  const { table_id } = req.params;

  if (!data || !data.reservation_id) {
    throw new APIError(400, "reservation_id is required");
  }

  const table = await service.read(Number(table_id));
  if (!table) {
    throw new APIError(404, `Table ${table_id} not found`);
  }

  res.locals.table = table;
  res.locals.reservation_id = data.reservation_id;
  next();
}

/**
 * Seat a reservation at a table
 */
async function seat(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const table = res.locals.table;
  const reservation_id = res.locals.reservation_id;

  if (!table || !table.table_id) {
    throw new APIError(400, "Invalid table data");
  }

  if (typeof reservation_id !== "number") {
    throw new APIError(400, "Invalid reservation_id");
  }

  const updatedTable = await service.seat(table.table_id, reservation_id);
  res.json({ data: updatedTable });
}

/**
 * Finish a table (clear the reservation)
 */
async function finishTable(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { table_id } = req.params;
  const table = await service.read(Number(table_id));

  if (!table) {
    return next({
      status: 404,
      message: `Table ${table_id} not found`,
    });
  }

  if (!table.reservation_id) {
    return next({
      status: 400,
      message: `Table ${table_id} is not occupied`,
    });
  }

  const updatedTable = await service.finish(Number(table_id));
  res.status(200).json({ data: updatedTable });
}

/**
 * Read a specific table
 */
async function read(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  const { table_id } = req.params;
  const table = await service.read(Number(table_id));
  
  if (!table) {
    throw new APIError(404, `Table ${table_id} not found`);
  }
  
  res.json({ data: table });
}

export const tablesController = {
  create: [asyncErrorBoundary(validateTableData), asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  read: asyncErrorBoundary(read),
  seat: [asyncErrorBoundary(validateSeat), asyncErrorBoundary(seat)],
  finish: asyncErrorBoundary(finishTable),
};
