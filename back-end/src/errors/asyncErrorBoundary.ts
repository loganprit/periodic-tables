import { AsyncErrorBoundaryFunction, AsyncDelegate } from "../types/errors";
import { CustomRequest, CustomResponse } from "../types/application";
import { NextFunction } from "express";

/**
 * Higher-order function that wraps async route handlers to catch errors
 * @param delegate - Async function to be wrapped
 * @param defaultStatus - Default HTTP status code for errors (defaults to 500)
 * @returns Express middleware function that handles async errors
 */
const asyncErrorBoundary: AsyncErrorBoundaryFunction = (
  delegate: AsyncDelegate,
  defaultStatus = 500
) => {
  return (
    request: CustomRequest,
    response: CustomResponse,
    next: NextFunction
  ): void => {
    Promise.resolve()
      .then(() => delegate(request, response, next))
      .catch((error: Error | unknown = {}) => {
        const errorObj = error as { status?: number; message?: string };
        const { status = defaultStatus, message = String(error) } = errorObj;
        next({
          status,
          message,
        });
      });
  };
};

export default asyncErrorBoundary;
