// routes/placementRoutes.js
const express = require('express');
const router = express.Router();
const Placement = require('../models/Placement');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');

// PUBLIC: GET all placements (filter by category optional)
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const q = {};
    if (category) q.category = category;
    const items = await Placement.find(q).sort({ createdAt: -1 });
    res.json(items);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// PUBLIC: GET single placement by id
router.get('/:id', async (req, res) => {
  try {
    const p = await Placement.findById(req.params.id);
    if (!p) return res.status(404).json({ message: 'Not found' });
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: create placement
router.post('/', protect, requireAdmin, async (req, res) => {
  try {
    const data = req.body;
    const p = new Placement(data);
    await p.save();
    res.json(p);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: update placement
router.put('/:id', protect, requireAdmin, async (req, res) => {
  try {
    const updated = await Placement.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

// ADMIN: delete placement
router.delete('/:id', protect, requireAdmin, async (req, res) => {
  try {
    await Placement.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
