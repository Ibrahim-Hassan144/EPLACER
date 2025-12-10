const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  // Must match the field stored in MongoDB
  passwordHash: { type: String, required: true },

  role: { type: String, enum: ["student", "admin"], default: "student" }
});

module.exports = mongoose.model("User", userSchema);
