const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {
  isValidDate,
  isValidTime,
  validateReservationDate,
} = require("../utils/dateValidation");
const { validateReservationTime } = require("../utils/timeValidation");

// Middleware function to validate reservation data
function validateReservationData(req, res, next) {
  const { data = {} } = req.body;
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

  if (dateValidationError) {
    return next({
      status: 400,
      message: dateValidationError,
    });
  }

  const timeValidationError = validateReservationTime(
    data.reservation_date,
    data.reservation_time
  );

  if (timeValidationError) {
    return next({
      status: 400,
      message: timeValidationError,
    });
  }

  next();
}

// Handler function to create a reservation
async function create(req, res, next) {
  console.log("Create reservation request received:", req.body);
  try {
    const data = await service.create(req.body.data);
    console.log("Reservation created successfully:", data);
    res.status(201).json({ data: data[0] }); // Return the first object in the array
  } catch (error) {
    console.error("Error in creating reservation:", error);
    next(error);
  }
}

// Handler function to list reservations
async function list(req, res, next) {
  const date = req.query.date;
  try {
    const data = await service.list(date);
    res.json({ data });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    next(error);
  }
}

module.exports = {
  create: [validateReservationData, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
};
