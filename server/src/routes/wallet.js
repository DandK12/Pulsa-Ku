const router = require("express").Router();
const auth = require("../middleware/auth");
const { getBalance, getHistory } = require("../controllers/walletController");

router.get("/balance", auth, getBalance);
router.get("/history", auth, getHistory);

module.exports = router;
