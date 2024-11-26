import { DateString, TimeString } from "../types/utils";

const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

/**
 * Formats a Date object as YYYY-MM-DD.
 * @param {Date} date - The date to format.
 * @returns {DateString} The formatted date string.
 */
function asDateString(date: Date): DateString {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

/**
 * Format a date string in ISO-8601 format as YYYY-MM-DD.
 * @param {string} dateString - The date string to format.
 * @returns {DateString} The formatted date string.
 * @throws {Error} If the date string is invalid.
 */
export function formatAsDate(dateString: string): DateString {
  const match = dateString.match(dateFormat);
  if (!match) {
    throw new Error("Invalid date string format. Expected YYYY-MM-DD");
  }
  return match[0];
}

/**
 * Format a time string in HH:MM:SS format as HH:MM.
 * @param {string} timeString - The time string to format.
 * @returns {TimeString} The formatted time string.
 * @throws {Error} If the time string is invalid.
 */
export function formatAsTime(timeString: string): TimeString {
  const match = timeString.match(timeFormat);
  if (!match) {
    throw new Error("Invalid time string format. Expected HH:MM");
  }
  return match[0];
}

/**
 * Today's date as YYYY-MM-DD.
 * @returns {DateString} The formatted date string.
 */
export function today(): DateString {
  return asDateString(new Date());
}

/**
 * Subtracts one day from the specified date.
 * @param {DateString} currentDate - The current date in YYYY-MM-DD format.
 * @returns {DateString} The date one day prior, formatted as YYYY-MM-DD.
 * @throws {Error} If the date string format is invalid.
 */
export function previous(currentDate: DateString): DateString {
  const parts = currentDate.split("-");
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD");
  }
  
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  
  const date = new Date(year, month, day);
  date.setDate(date.getDate() - 1);
  return asDateString(date);
}

/**
 * Adds one day to the specified date.
 * @param {DateString} currentDate - The current date in YYYY-MM-DD format.
 * @returns {DateString} The date one day after, formatted as YYYY-MM-DD.
 * @throws {Error} If the date string format is invalid.
 */
export function next(currentDate: DateString): DateString {
  const parts = currentDate.split("-");
  if (parts.length !== 3) {
    throw new Error("Invalid date format. Expected YYYY-MM-DD");
  }
  
  const year = Number(parts[0]);
  const month = Number(parts[1]) - 1;
  const day = Number(parts[2]);
  
  const date = new Date(year, month, day);
  date.setDate(date.getDate() + 1);
  return asDateString(date);
}
