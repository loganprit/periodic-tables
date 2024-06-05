// Function to check if the reservation time is valid
function validateReservationTime(date, time) {
  const open = "10:30";
  const close = "21:30";

  const reservationDateTime = new Date(`${date}T${time}:00`);
  const openingTime = new Date(`${date}T${open}:00`);
  const closingTime = new Date(`${date}T${close}:00`);
  const now = new Date();

  // Check if the reservation date and time is in the past
  if (reservationDateTime < now) {
    return "Reservation date and time must be in the future";
  }

  // Check if the reservation time is before the restaurant opens
  if (reservationDateTime < openingTime) {
    return "Restaurant is not open at that time";
  }

  // Check if the reservation time is after the restaurant closes
  if (reservationDateTime > closingTime) {
    return "Restaurant is closed at that time";
  }

  return null; // No validation errors
}

module.exports = {
  validateReservationTime,
};
