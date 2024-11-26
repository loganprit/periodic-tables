import { DateString, TimeString } from "../types/utils";

/**
 * Validates the reservation time.
 * @param {DateString} date - The date of the reservation.
 * @param {TimeString} time - The time of the reservation.
 * @returns {string|null} The validation error message, or null if valid.
 */
function validateReservationTime(date: DateString, time: TimeString): string | null {
  const open = "10:30";
  const close = "21:30";

  const reservationDateTime = new Date(`${date}T${time}:00`);
  const openingTime = new Date(`${date}T${open}:00`);
  const closingTime = new Date(`${date}T${close}:00`);
  const now = new Date();

  if (reservationDateTime < now) {
    return "Reservation date and time must be in the future";
  }

  if (reservationDateTime < openingTime) {
    return "Restaurant is not open at that time";
  }

  if (reservationDateTime > closingTime) {
    return "Restaurant is closed at that time";
  }

  return null;
}

module.exports = {
  validateReservationTime,
};
