import { NextFunction } from "express";
import { CustomRequest, CustomResponse } from "../types/application";
import { TableData } from "../types/application";
import { APIError } from "../types/errors";
import { tablesService as service } from "./tables.service";
import asyncErrorBoundary from "../errors/asyncErrorBoundary";

/**
 * Middleware to validate table data
 */
function validateTableData(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): void {
  const { data = {} } = req.body as { data: Partial<TableData> };
  const requiredFields: Array<keyof TableData> = ["table_name", "capacity"];

  for (const field of requiredFields) {
    if (!data[field]) {
      return next(new APIError(400, `Table must include a ${field}`));
    }
  }

  if (typeof data.table_name !== "string" || data.table_name.length < 2) {
    return next(
      new APIError(
        400,
        "Table must include a table_name with at least 2 characters"
      )
    );
  }

  if (typeof data.capacity !== "number" || data.capacity < 1) {
    return next(new APIError(400, "Table must include a valid capacity"));
  }

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
  try {
    const data = await service.create(req.body.data);
    res.status(201).json({ data: data[0] });
  } catch (error) {
    next(error);
  }
}

/**
 * Get a list of tables
 */
async function list(
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): Promise<void> {
  try {
    const data = await service.list();
    res.json({ data });
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
  const { table_id } = req.params;
  const { data = {} } = req.body as { data: { reservation_id?: number } };

  if (!data.reservation_id) {
    return next(new APIError(400, "reservation_id is missing"));
  }

  try {
    const updatedTable = await service.seat(Number(table_id), data.reservation_id);
    res.json({ data: updatedTable });
  } catch (error) {
    next(
      new APIError(
        error instanceof APIError ? error.status : 500,
        error instanceof Error ? error.message : "An unknown error occurred"
      )
    );
  }
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
    return next(new APIError(404, `Table ${table_id} not found`));
  }

  if (!table.reservation_id) {
    return next(new APIError(400, `Table ${table_id} is not occupied`));
  }

  const updatedTable = await service.finish(Number(table_id));
  res.status(200).json({ data: updatedTable });
}

export const tablesController = {
  create: [validateTableData, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  seat: asyncErrorBoundary(seat),
  finish: asyncErrorBoundary(finishTable),
};
