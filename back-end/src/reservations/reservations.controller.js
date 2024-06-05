const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {
  isValidDate,
  isValidTime,
  validateReservationDate,
} = require("../utils/dateValidation");

// Middleware function to validate reservation data
function validateReservationData(req, res, next) {
  const { data = {} } = req.body;
  console.log({ data });
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

  const dateValidationError = validateReservationDate(data.reservation_date);
  console.log("Date validation error:", dateValidationError); // Log the error

  if (dateValidationError) {
    return next({
      status: 400,
      message: dateValidationError,
    });
  }

  next();
}

// Handler function to create a reservation
async function create(req, res) {
  const data = await service.create(req.body.data);
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
