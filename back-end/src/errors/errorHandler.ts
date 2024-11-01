import { ErrorHandlerFunction, APIError } from "../types/errors";
import { CustomRequest, CustomResponse } from "../types/application";
import { NextFunction } from "express";

/**
 * Global error handler middleware for the Express application
 * @param error - Error object with optional status and message
 * @param request - Express request object
 * @param response - Express response object
 * @param next - Express next function
 */
const errorHandler: ErrorHandlerFunction = (
  error: APIError,
  request: CustomRequest,
  response: CustomResponse,
  next: NextFunction
): void => {
  const { status = 500, message = "Something went wrong!" } = error;
  response.status(status).json({ error: message });
};

export default errorHandler;
