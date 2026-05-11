const router = require("express").Router();
const auth = require("../middleware/auth");
const {
  createTopup,
  tripayCallback,
} = require("../controllers/topupController");

router.post("/create", auth, createTopup);
router.post("/callback", tripayCallback); // no auth (called by Tripay)

module.exports = router;
