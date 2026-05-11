const pool = require("../config/db");
const crypto = require("crypto");

exports.createTopup = async (req, res) => {
  const { amount, payment_method } = req.body;
  const merchantRef = "TOPUP-" + Date.now();

  // Integrasi Tripay (contoh sederhana)
  try {
    // Simpan order ke DB dulu
    const order = await pool.query(
      "INSERT INTO topup_orders (user_id, amount, merchant_ref, status, payment_method) VALUES ($1,$2,$3,$4,$5) RETURNING *",
      [req.user.id, amount, merchantRef, "pending", payment_method],
    );

    // Panggil Tripay API di sini (lihat docs Tripay)
    // const tripayRes = await fetch('https://tripay.co.id/api/transaction/create', { ... })

    res.json({ order: order.rows[0], merchant_ref: merchantRef });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.tripayCallback = async (req, res) => {
  // Verifikasi signature dari Tripay
  const signature = req.headers["x-callback-signature"];
  // Proses update status transaksi
  const { merchant_ref, status } = req.body;
  if (status === "PAID") {
    const order = await pool.query(
      "SELECT * FROM topup_orders WHERE merchant_ref = $1",
      [merchant_ref],
    );
    if (order.rows.length) {
      await pool.query(
        "UPDATE wallets SET balance = balance + $1 WHERE user_id = $2",
        [order.rows[0].amount, order.rows[0].user_id],
      );
      await pool.query(
        "UPDATE topup_orders SET status = $1 WHERE merchant_ref = $2",
        ["success", merchant_ref],
      );
      await pool.query(
        "INSERT INTO wallet_logs (user_id, type, amount, description) VALUES ($1,$2,$3,$4)",
        [
          order.rows[0].user_id,
          "credit",
          order.rows[0].amount,
          "Topup via " + order.rows[0].payment_method,
        ],
      );
    }
  }
  res.json({ success: true });
};
