import { NextFunction } from "express";
import { CustomRequest, CustomResponse } from "./application";

/**
 * Custom API Error class that extends Error
 */
export class APIError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "APIError";
  }
}

/**
 * Error handler middleware function type
 */
export type ErrorHandlerFunction = (
  error: APIError,
  request: CustomRequest,
  response: CustomResponse,
  next: NextFunction
) => void;

/**
 * Not found middleware function type
 */
export type NotFoundFunction = (
  request: CustomRequest,
  response: CustomResponse,
  next: NextFunction
) => void;

/**
 * Async error boundary delegate function type
 */
export type AsyncDelegate = (
  request: CustomRequest,
  response: CustomResponse,
  next: NextFunction
) => Promise<unknown>;

/**
 * Async error boundary wrapper function type
 */
export type AsyncErrorBoundaryFunction = (
  delegate: AsyncDelegate,
  defaultStatus?: number
) => (
  request: CustomRequest,
  response: CustomResponse,
  next: NextFunction
) => void;