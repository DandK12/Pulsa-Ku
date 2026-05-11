const router = require("express").Router();
const auth = require("../middleware/auth");
const pool = require("../config/db");

router.get("/", auth, async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM transactions WHERE user_id = $1 ORDER BY created_at DESC LIMIT 50",
      [req.user.id],
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
