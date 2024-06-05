// Function to check if a date string is in valid format (YYYY-MM-DD)
function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false; // Invalid format
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false; // NaN value, Invalid date
  return d.toISOString().slice(0, 10) === dateString;
}

// Function to check if a time string is in valid format (HH:MM)
function isValidTime(timeString) {
  const regEx = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return regEx.test(timeString);
}

// Function to check if the reservation date is valid
function validateReservationDate(date) {
  const today = new Date();
  const reservationDate = new Date(date);

  // Check if the reservation date is in the past
  if (reservationDate < today.setHours(0, 0, 0, 0)) {
    return "Reservation date must be in the future";
  }

  // Check if the reservation date is on a Tuesday (0 represents Sunday, so 2 represents Tuesday)
  if (reservationDate.getUTCDay() === 2) {
    return "Reservation cannot be made on a Tuesday (restaurant closed)";
  }

  return null; // No validation errors
}

module.exports = {
  isValidDate,
  isValidTime,
  validateReservationDate,
};
