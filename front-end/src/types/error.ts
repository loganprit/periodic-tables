/**
 * Custom error interface for application-wide error handling
 */
export interface ApplicationError {
  message: string;
  status?: number;
  name?: string;
  stack?: string;
}

/**
 * API error response interface
 */
export interface APIErrorResponse {
  error: ApplicationError;
}

/**
 * Error state interface for components
 */
export interface ErrorState {
  error: ApplicationError | null;
}
