// routes/settings.js

const express = require('express');
const Settings = require('../models/Setting');
const router = express.Router();

// Middleware to check authentication (this is just a placeholder)
const authenticateUser = (req, res, next) => {
  // Your authentication logic here (JWT, sessions, etc.)
  // Assume userId is available in req.user after authentication
  next();
};

// GET settings
router.get('/', authenticateUser, async (req, res) => {
  try {
    const settings = await Settings.findOne({ userId: req.user._id }); // Assuming user ID is stored in req.user
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// PUT settings
router.put('/', authenticateUser, async (req, res) => {
  try {
    const settings = await Settings.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );
    if (!settings) {
      return res.status(404).json({ message: 'Settings not found' });
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
