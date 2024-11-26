/**
 * Checks if a date string is in valid format (YYYY-MM-DD).
 * @param {string} dateString - The date string to validate.
 * @returns {boolean} True if the date string is valid, otherwise false.
 */
function isValidDate(dateString: string): boolean {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false;
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false;
  return d.toISOString().slice(0, 10) === dateString;
}

/**
 * Checks if a time string is in valid format (HH:MM).
 * @param {string} timeString - The time string to validate.
 * @returns {boolean} True if the time string is valid, otherwise false.
 */
function isValidTime(timeString: string): boolean {
  const regEx = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return regEx.test(timeString);
}

/**
 * Validates the reservation date.
 * @param {string} date - The date to validate.
 * @returns {string|null} The validation error message, or null if valid.
 */
function validateReservationDate(date: string): string | null {
  const today = new Date();
  const reservationDate = new Date(date);

  if (reservationDate.getTime() < today.setHours(0, 0, 0, 0)) {
    return "Reservation date must be in the future";
  }

  if (reservationDate.getUTCDay() === 2) {
    return "Reservation cannot be made on a Tuesday (restaurant closed)";
  }

  return null;
}

module.exports = {
  isValidDate,
  isValidTime,
  validateReservationDate,
};
