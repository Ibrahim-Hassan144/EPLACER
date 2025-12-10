// routes/internshipRoutes.js
const express = require('express');
const router = express.Router();
const Internship = require('../models/Internship');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');

// GET all internships
router.get('/', async (req, res) => {
  try {
    const items = await Internship.find().sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// GET one
router.get('/:id', async (req, res) => {
  try {
    const it = await Internship.findById(req.params.id);
    if (!it) return res.status(404).json({ message: 'Not found' });
    res.json(it);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN create
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const data = req.body;
    const it = new Internship(data);
    await it.save();
    res.json(it);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN update
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const updated = await Internship.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN delete
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    await Internship.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
