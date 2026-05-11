const router = require("express").Router();
const auth = require("../middleware/auth");
const role = require("../middleware/role");
const {
  requestWithdraw,
  approveWithdraw,
} = require("../controllers/withdrawController");

router.post("/request", auth, requestWithdraw);
router.patch("/:id/approve", auth, role("admin"), approveWithdraw);

module.exports = router;
