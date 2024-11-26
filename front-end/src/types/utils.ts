/**
 * Type definitions for date and time formats
 */

/** Date string in YYYY-MM-DD format */
export type DateString = string;

/** Time string in HH:MM format */
export type TimeString = string;

/** Common API parameters */
export interface TimeValidationParams {
  date: DateString;
  time: TimeString;
}

/** Restaurant hours configuration */
export interface RestaurantHours {
  opening: TimeString;
  closing: TimeString;
} 