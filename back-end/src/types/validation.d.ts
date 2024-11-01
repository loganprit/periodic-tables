/**
 * Time format for restaurant hours (HH:mm)
 */
export type TimeString = string;

/**
 * Date format (YYYY-MM-DD)
 */
export type DateString = string;

/**
 * Validation error messages for time-related validations
 */
export enum TimeValidationError {
  INVALID_FORMAT = "Invalid date or time format",
  PAST_DATE_TIME = "Reservation date and time must be in the future",
  BEFORE_OPENING = "Restaurant is not open at that time",
  AFTER_CLOSING = "Restaurant is closed at that time"
}

/**
 * Restaurant hours configuration
 */
export interface RestaurantHours {
  readonly OPENING_TIME: TimeString;
  readonly CLOSING_TIME: TimeString;
}

/**
 * Date validation error messages
 */
export enum DateValidationError {
  PAST_DATE = "Reservation date must be in the future",
  CLOSED_DAY = "Reservation cannot be made on a Tuesday (restaurant closed)"
}

/**
 * Regular expressions for date and time validation
 */
export const DATE_REGEX = /^\d{4}-\d{2}-\d{2}$/ as const;
export const TIME_REGEX = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/ as const;
