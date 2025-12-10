// routes/applicationRoutes.js
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

const Application = require('../models/Application');
const Placement = require('../models/Placement');
const Internship = require('../models/Internship');
const { protect } = require('../middleware/auth');
const { requireAdmin } = require('../middleware/roles');

// multer setup -> store in /uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    const fname = `${Date.now()}-${file.originalname.replace(/\s+/g, '-')}`;
    cb(null, fname);
  },
});
const upload = multer({ storage });

/* ================================
   STUDENT: CREATE APPLICATION
================================ */
router.post('/', protect, upload.single('cv'), async (req, res) => {
  try {
    const { placementId, internshipId, fullname, email, phone, cover } = req.body;
    if (!placementId && !internshipId)
      return res.status(400).json({ message: 'placementId or internshipId required' });

    const appData = {
      user: req.user.id,
      placementId: placementId || null,
      internshipId: internshipId || null,
      fullname,
      email,
      phone,
      cover,
      cvPath: req.file ? `/uploads/${req.file.filename}` : null,
      status: 'pending',
    };

    const app = new Application(appData);
    await app.save();

    // decrement slot
    if (placementId) {
      await Placement.findByIdAndUpdate(placementId, { $inc: { slots: -1 } });
    } else if (internshipId) {
      await Internship.findByIdAndUpdate(internshipId, { $inc: { slots: -1 } });
    }

    res.json(app);
  } catch (err) {
    console.error("CREATE APPLICATION ERROR:", err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ================================
   ADMIN: LIST ALL APPLICATIONS
================================ */
router.get('/', protect, requireAdmin, async (req, res) => {
  try {
    const list = await Application.find()
      .sort({ appliedAt: -1 })
      .populate('user', 'name email')
      .populate('placementId')
      .populate('internshipId');

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ================================
   ADMIN: UPDATE STATUS
================================ */
router.put('/:id/status', protect, requireAdmin, async (req, res) => {
  try {
    const { status } = req.body;
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    app.status = status;
    await app.save();

    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

/* ================================
   🔥 STUDENT: DELETE OWN APPLICATION
================================ */
router.delete('/:id', protect, async (req, res) => {
  try {
    const app = await Application.findById(req.params.id);
    if (!app) return res.status(404).json({ message: 'Application not found' });

    // ensure student owns the application
    if (String(app.user) !== String(req.user.id)) {
      return res.status(403).json({ message: "Not allowed" });
    }

    // restore slot
    if (app.placementId) {
      await Placement.findByIdAndUpdate(app.placementId, { $inc: { slots: 1 } });
    } else if (app.internshipId) {
      await Internship.findByIdAndUpdate(app.internshipId, { $inc: { slots: 1 } });
    }

    await app.deleteOne();

    res.json({ message: "Application cancelled" });
  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

/* ================================
   STUDENT: MY APPLICATIONS
================================ */
router.get('/me/list', protect, async (req, res) => {
  try {
    const list = await Application.find({ user: req.user.id })
      .sort({ appliedAt: -1 })
      .populate('placementId')
      .populate('internshipId');

    res.json(list);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
