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
  error: APIError | Error,
  request: CustomRequest,
  response: CustomResponse,
  next: NextFunction
): void => {
  const status = error instanceof APIError ? error.status : 500;
  const message = error.message || "Something went wrong!";
  
  response.status(status).json({
    error: message,
    status,
  });
};

export default errorHandler;
