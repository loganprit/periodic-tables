const router = require("express").Router();
const controller = require("./tables.controller");

router.route("/").get(controller.list).post(controller.create);
router.route("/:table_id/seat").put(controller.seat);
router
  .route("/:table_id/seat")
  .put(controller.seat)
  .delete(controller.finishTable);

module.exports = router;
