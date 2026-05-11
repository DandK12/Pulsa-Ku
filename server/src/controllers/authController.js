const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const signToken = (user) =>
  jwt.sign(
    { id: user.id, role: user.role, email: user.email },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );

exports.register = async (req, res) => {
  const { name, email, password, role = "seller" } = req.body;
  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length)
      return res.status(400).json({ message: "Email sudah terdaftar" });

    const hash = await bcrypt.hash(password, 12);
    const result = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1,$2,$3,$4) RETURNING id, name, email, role",
      [name, email, hash, role],
    );
    res
      .status(201)
      .json({ token: signToken(result.rows[0]), user: result.rows[0] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Email atau password salah" });

    res.json({
      token: signToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.googleLogin = async (req, res) => {
  // Verifikasi Google ID token menggunakan google-auth-library
  // npm install google-auth-library
  const { OAuth2Client } = require("google-auth-library");
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  try {
    const ticket = await client.verifyIdToken({
      idToken: req.body.credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name, picture } = ticket.getPayload();
    let user = (
      await pool.query("SELECT * FROM users WHERE email = $1", [email])
    ).rows[0];
    if (!user) {
      const r = await pool.query(
        "INSERT INTO users (name, email, avatar, role) VALUES ($1,$2,$3,$4) RETURNING *",
        [name, email, picture, "seller"],
      );
      user = r.rows[0];
    }
    res.json({ token: signToken(user), user });
  } catch (err) {
    res.status(400).json({ message: "Google login gagal" });
  }
};

exports.getMe = async (req, res) => {
  const result = await pool.query(
    "SELECT id, name, email, role, avatar FROM users WHERE id = $1",
    [req.user.id],
  );
  res.json(result.rows[0]);
};
