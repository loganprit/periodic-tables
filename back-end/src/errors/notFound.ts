import { NotFoundFunction } from "../types/errors";
import { CustomRequest, CustomResponse } from "../types/application";
import { NextFunction } from "express";

/**
 * Express middleware that handles 404 Not Found errors
 * @param req - Express request object
 * @param res - Express response object
 * @param next - Express next function
 */
const notFound: NotFoundFunction = (
  req: CustomRequest,
  res: CustomResponse,
  next: NextFunction
): void => {
  next({ status: 404, message: `Path not found: ${req.originalUrl}` });
};

export default notFound;
