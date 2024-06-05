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
  validateReservationDate,
};
