const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function validateTableData(req, res, next) {
  const { data = {} } = req.body;
  const requiredFields = ["table_name", "capacity"];

  for (let field of requiredFields) {
    if (!data[field]) {
      return next({
        status: 400,
        message: `Table must include a ${field}`,
      });
    }
  }

  if (typeof data.table_name !== "string" || data.table_name.length < 2) {
    return next({
      status: 400,
      message: `Table must include a table_name with at least 2 characters`,
    });
  }

  if (typeof data.capacity !== "number" || data.capacity < 1) {
    return next({
      status: 400,
      message: `Table must include a valid capacity`,
    });
  }

  next();
}

async function create(req, res, next) {
  try {
    const data = await service.create(req.body.data);
    res.status(201).json({ data: data[0] });
  } catch (error) {
    next(error);
  }
}

async function list(req, res, next) {
  try {
    const data = await service.list();
    res.json({ data });
  } catch (error) {
    next(error);
  }
}

async function seat(req, res, next) {
  const { table_id } = req.params;
  const { data = {} } = req.body;

  if (!data.reservation_id) {
    return next({
      status: 400,
      message: "reservation_id is missing",
    });
  }

  try {
    const updatedTable = await service.seat(table_id, data.reservation_id);
    res.json({ data: updatedTable });
  } catch (error) {
    next({
      status: error.status || 500,
      message: error.message || "An unknown error occurred",
    });
  }
}

async function finishTable(req, res, next) {
  const { table_id } = req.params;
  const table = await service.read(table_id);

  if (!table) {
    return next({ status: 404, message: `Table ${table_id} not found` });
  }

  if (!table.reservation_id) {
    return next({ status: 400, message: `Table ${table_id} is not occupied` });
  }

  const updatedTable = await service.finish(table_id);
  console.log(
    "Table finished:",
    table_id,
    "Updated reservation status to finished"
  );
  res.status(200).json({ data: updatedTable });
}

module.exports = {
  create: [validateTableData, asyncErrorBoundary(create)],
  list: asyncErrorBoundary(list),
  seat: asyncErrorBoundary(seat),
  finishTable: asyncErrorBoundary(finishTable),
};
