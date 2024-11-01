/**
 * Time format for restaurant hours (HH:mm)
 */
export type TimeString = string;

/**
 * Date format (YYYY-MM-DD)
 */
export type DateString = string;

/**
 * Regular expressions for date and time validation
 */
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/;
export const TIME_REGEX = /^([0-1][0-9]|2[0-3]):[0-5][0-9]$/;

/**
 * Date validation error messages
 */
export enum DateValidationError {
  PAST_DATE = "Reservation must be for a future date",
  CLOSED_DAY = "Restaurant is closed on Tuesdays"
}

/**
 * Time validation error messages
 */
export enum TimeValidationError {
  INVALID_FORMAT = "Invalid time format",
  PAST_DATE_TIME = "Reservation must be for a future time",
  BEFORE_OPENING = "Reservation must be after opening time (10:30 AM)",
  AFTER_CLOSING = "Reservation must be before closing time (9:30 PM)"
}

/**
 * Restaurant hours configuration
 */
export interface RestaurantHours {
  OPENING_TIME: string;
  CLOSING_TIME: string;
}
