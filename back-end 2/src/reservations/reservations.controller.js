const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

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

// Middleware function to validate reservation data
function validateReservationData(req, res, next) {
  const { data = {} } = req.body;
  console.log("Received data:", data); // Log the received data
  const requiredFields = [
    "first_name",
    "last_name",
    "mobile_number",
    "reservation_date",
    "reservation_time",
    "people",
  ];
  for (let field of requiredFields) {
    if (!data[field]) {
      return next({
        status: 400,
        message: `Reservation must include a ${field}`,
      });
    }
  }
  if (typeof data.people !== "number" || data.people < 1) {
    return next({
      status: 400,
      message: `Reservation must include a valid number of people`,
    });
  }
  if (!isValidDate(data.reservation_date)) {
    return next({
      status: 400,
      message: `Reservation must include a valid reservation_date`,
    });
  }
  if (!isValidTime(data.reservation_time)) {
    return next({
      status: 400,
      message: `Reservation must include a valid reservation_time`,
    });
  }
  next();
}

// Handler function to create a reservation
async function create(req, res) {
  console.log("Received request to create reservation:", req.body.data);
  const data = await service.create(req.body.data);
  console.log("Inserted reservation:", data);
  res.status(201).json({ data: data[0] }); // Return the first object in the array
}

// Handler function to list reservations
async function list(req, res) {
  const date = req.query.date;
  const data = await service.list(date);
  res.json({ data });
}

module.exports = {
  create: [validateReservationData, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
