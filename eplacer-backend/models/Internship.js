// models/Internship.js
const mongoose = require('mongoose');

const InternshipSchema = new mongoose.Schema({
  slug: { type: String, required: false, index: true },
  company: { type: String, required: true },
  department: { type: String },
  location: { type: String },
  description: { type: String },
  requirements: { type: String },
  slots: { type: Number, default: 0 },
  phone: { type: String },
  email: { type: String },
  logo: { type: String }, // path or URL
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Internship', InternshipSchema);
