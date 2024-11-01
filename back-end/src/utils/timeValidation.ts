import { TimeString, DateString, TimeValidationError, RestaurantHours } from "../types/validation";

/**
 * Constants for restaurant operating hours
 */
const restaurantHours: RestaurantHours = {
  OPENING_TIME: "10:30",
  CLOSING_TIME: "21:30"
} as const;

/**
 * Validates a reservation time against business rules
 * @param date - The reservation date in YYYY-MM-DD format
 * @param time - The reservation time in HH:MM format
 * @returns TimeValidationError message if invalid, null if valid
 */
function validateReservationTime(date: DateString, time: TimeString): TimeValidationError | null {
  const reservationDateTime = new Date(`${date}T${time}:00`);
  const openingTime = new Date(`${date}T${restaurantHours.OPENING_TIME}:00`);
  const closingTime = new Date(`${date}T${restaurantHours.CLOSING_TIME}:00`);
  const now = new Date();

  // Validate that the date object was created successfully
  if (isNaN(reservationDateTime.getTime())) {
    return TimeValidationError.INVALID_FORMAT;
  }

  if (reservationDateTime < now) {
    return TimeValidationError.PAST_DATE_TIME;
  }

  if (reservationDateTime < openingTime) {
    return TimeValidationError.BEFORE_OPENING;
  }

  if (reservationDateTime > closingTime) {
    return TimeValidationError.AFTER_CLOSING;
  }

  return null;
}

export {
  validateReservationTime,
  restaurantHours,
};
