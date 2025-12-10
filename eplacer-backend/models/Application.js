// models/Application.js
const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // optional if guest
  placementId: { type: mongoose.Schema.Types.ObjectId, ref: 'Placement' },
  internshipId: { type: mongoose.Schema.Types.ObjectId, ref: 'Internship' },
  fullname: { type: String },
  email: { type: String },
  phone: { type: String },
  cover: { type: String },
  cvPath: { type: String }, // file path in /uploads
  status: { type: String, enum: ['pending','accepted','rejected','cancelled'], default: 'pending' },
  appliedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Application', ApplicationSchema);
