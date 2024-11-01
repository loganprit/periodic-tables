import { DateString, TimeString, DateValidationError, DATE_REGEX, TIME_REGEX } from "../types/validation";

/**
 * Validates if a string matches the ISO date format (YYYY-MM-DD)
 * @param dateString - The date string to validate
 * @returns boolean indicating if the date is valid
 */
function isValidDate(dateString: DateString): boolean {
  if (!dateString.match(DATE_REGEX)) return false;
  
  const d = new Date(dateString);
  const dNum = d.getTime();
  
  // Check if date is invalid (NaN) but allow for 0 timestamp
  if (!dNum && dNum !== 0) return false;
  
  return d.toISOString().slice(0, 10) === dateString;
}

/**
 * Validates if a string matches the 24-hour time format (HH:MM)
 * @param timeString - The time string to validate
 * @returns boolean indicating if the time format is valid
 */
function isValidTime(timeString: TimeString): boolean {
  return TIME_REGEX.test(timeString);
}

/**
 * Validates a reservation date against business rules
 * @param date - The date string to validate
 * @returns DateValidationError message if invalid, null if valid
 */
function validateReservationDate(date: DateString): DateValidationError | null {
  const today = new Date();
  const reservationDate = new Date(date);

  // Reset time to start of day for comparison
  if (reservationDate.getTime() < today.setHours(0, 0, 0, 0)) {
    return DateValidationError.PAST_DATE;
  }

  // Check if reservation is on Tuesday (restaurant closed)
  if (reservationDate.getUTCDay() === 2) {
    return DateValidationError.CLOSED_DAY;
  }

  return null;
}

export {
  isValidDate,
  isValidTime,
  validateReservationDate,
};
