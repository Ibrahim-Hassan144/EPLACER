// routes/authRoutes.js
const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Generate JWT
function generateToken(user) {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
}

// ===============================
// LOGIN (students + admin)
// ===============================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid credentials" });

    // 2. Compare entered password with stored passwordHash
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid)
      return res.status(400).json({ message: "Invalid credentials" });

    // 3. Respond with JWT + user info
    return res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ===============================
// REGISTER (optional)
// ===============================
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (await User.findOne({ email })) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      passwordHash: hashed,
      role: "student",
    });

    return res.json({
      token: generateToken(user),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
