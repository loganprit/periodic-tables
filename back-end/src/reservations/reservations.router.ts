const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/").post(controller.create).get(controller.list);
router.route("/:reservation_id").get(controller.read).put(controller.update);
router.route("/:reservation_id/seat").put(controller.seat);
router.route("/:reservation_id/status").put(controller.updateStatus);
router.route("/:table_id/seat").delete(controller.finish);
router.route("/search").get(controller.list);

module.exports = router;
