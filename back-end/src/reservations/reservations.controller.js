const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");
const {
  isValidDate,
  isValidTime,
  validateReservationDate,
} = require("../utils/dateValidation");
const { validateReservationTime } = require("../utils/timeValidation");

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

  if (
    typeof data.people !== "number" ||
    isNaN(data.people) ||
    data.people < 1
  ) {
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

async function create(req, res, next) {
  const { data } = req.body;
  if (data.status && data.status !== "booked") {
    return next({
      status: 400,
      message: `Status ${data.status} is not valid for new reservations`,
    });
  }
  try {
    const newData = { ...data, status: "booked" }; // Ensure the status is always booked on creation
    const createdData = await service.create(newData);
    res.status(201).json({ data: createdData });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  const { date, mobile_number } = req.query;
  try {
    const data = await service.list(date, mobile_number);
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function read(req, res, next) {
  const { reservation_id } = req.params;
  try {
    const data = await service.read(reservation_id);
    if (data) {
      res.status(200).json({ data });
    } else {
      next({ status: 404, message: `Reservation ${reservation_id} not found` });
    }
  } catch (error) {
    next(error);
  }
}

async function seat(req, res, next) {
  const { reservation_id } = req.params;
  const { table_id } = req.body.data;
  try {
    const data = await service.seat(reservation_id, table_id);
    res.json({ data });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
}

async function updateStatus(req, res, next) {
  const { reservation_id } = req.params;
  const { status } = req.body.data;

  if (!["booked", "seated", "finished", "cancelled"].includes(status)) {
    return next({ status: 400, message: `Status ${status} is not valid` });
  }

  try {
    const currentReservation = await service.read(reservation_id);
    if (!currentReservation) {
      return next({
        status: 404,
        message: `Reservation ${reservation_id} not found`,
      });
    }

    if (currentReservation.status === "finished") {
      return next({
        status: 400,
        message: "A finished reservation cannot be updated",
      });
    }

    const updatedData = await service.updateStatus(reservation_id, status);
    res.json({ data: updatedData });
  } catch (error) {
    next(error);
  }
}

async function finish(req, res, next) {
  const { table_id } = req.params;
  try {
    const data = await service.finish(table_id);
    res.json({ data: data[0] });
  } catch (error) {
    next({ status: 400, message: error.message });
  }
}

async function update(req, res, next) {
  const { reservation_id } = req.params;
  const { data } = req.body;

  try {
    const currentReservation = await service.read(reservation_id);
    if (!currentReservation) {
      return next({
        status: 404,
        message: `Reservation ${reservation_id} not found`,
      });
    }

    if (currentReservation.status !== "booked") {
      return next({
        status: 400,
        message: "Only booked reservations can be edited",
      });
    }

    const updatedReservation = { ...currentReservation, ...data };
    const updatedData = await service.update(
      reservation_id,
      updatedReservation
    );
    res.json({ data: updatedData[0] });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  create: [validateReservationData, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  read: asyncErrorBoundary(read),
  seat: asyncErrorBoundary(seat),
  updateStatus: asyncErrorBoundary(updateStatus),
  finish: asyncErrorBoundary(finish),
  update: [validateReservationData, asyncErrorBoundary(update)],
};
