const pool = require("../config/db");

exports.requestWithdraw = async (req, res) => {
  const { amount, bank_account, bank_name } = req.body;
  try {
    const wallet = await pool.query(
      "SELECT balance FROM wallets WHERE user_id = $1",
      [req.user.id],
    );
    if (!wallet.rows[0] || wallet.rows[0].balance < amount)
      return res.status(400).json({ message: "Saldo tidak cukup" });

    await pool.query(
      "UPDATE wallets SET balance = balance - $1 WHERE user_id = $2",
      [amount, req.user.id],
    );
    const result = await pool.query(
      "INSERT INTO withdrawals (user_id, amount, bank_account, bank_name, status) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [req.user.id, amount, bank_account, bank_name, "pending"],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.approveWithdraw = async (req, res) => {
  const result = await pool.query(
    "UPDATE withdrawals SET status = $1, approved_at = NOW() WHERE id = $2 RETURNING *",
    ["approved", req.params.id],
  );
  res.json(result.rows[0]);
};
