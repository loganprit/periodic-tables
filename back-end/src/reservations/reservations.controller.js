const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

// Create handler for reservation resources
async function create(req, res) {
  console.log("Received request to create reservation:", req.body.data);
  const data = await service.create(req.body.data);
  console.log("Inserted reservation:", data);
  res.status(201).json({ data });
}

// List handler for reservation resources
async function list(req, res) {
  const date = req.query.date;
  const data = await service.list(date);
  res.json({ data });
}

module.exports = {
  create: asyncErrorBoundary(create),
  list: asyncErrorBoundary(list),
};
