import { NotFoundFunction, APIError } from "../types/errors";
import { CustomRequest, CustomResponse } from "../types/application";
import { NextFunction } from "express";

/**
 * Express middleware that handles 404 Not Found errors
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 * @throws {APIError} 404 error with path not found message
 */
const notFound: NotFoundFunction = (
  req: CustomRequest,
  _res: CustomResponse,
  next: NextFunction
): void => {
  const error = new APIError(404, `Path not found: ${req.originalUrl}`);
  error.name = "NotFoundError";
  next(error);
};

export default notFound;
