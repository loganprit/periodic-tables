function isValidDate(dateString) {
  const regEx = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regEx)) return false;
  const d = new Date(dateString);
  const dNum = d.getTime();
  if (!dNum && dNum !== 0) return false;
  return d.toISOString().slice(0, 10) === dateString;
}

function isValidTime(timeString) {
  const regEx = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
  return regEx.test(timeString);
}

function validateReservationDate(date) {
  const today = new Date();
  const reservationDate = new Date(date);

  if (reservationDate < today.setHours(0, 0, 0, 0)) {
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
