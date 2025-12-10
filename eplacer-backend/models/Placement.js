// models/Placement.js
const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
  // use slug / key for stable referencing (optional)
  slug: { type: String, required: false, index: true },
  title: { type: String, required: true },
  category: { type: String, default: 'General' },
  location: { type: String },
  description: { type: String },
  slots: { type: Number, default: 0 },
  phone: { type: String },
  email: { type: String },
  image: { type: String }, // path or URL
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Placement', PlacementSchema);
