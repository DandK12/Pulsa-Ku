const pool = require("../config/db");

exports.getBalance = async (req, res) => {
  const result = await pool.query(
    "SELECT balance FROM wallets WHERE user_id = $1",
    [req.user.id],
  );
  res.json(result.rows[0] || { balance: 0 });
};

exports.getHistory = async (req, res) => {
  const result = await pool.query(
    "SELECT * FROM wallet_logs WHERE user_id = $1 ORDER BY created_at DESC LIMIT 30",
    [req.user.id],
  );
  res.json(result.rows);
};
