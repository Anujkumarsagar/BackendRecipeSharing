const express = require("express");
const router = express.Router();

// Import controllers
const { signup, login, sendOtp } = require("../controllers/Auth");
const { auth } = require("../middleware/auth"); // Assuming you have this middleware

// User routes
router.post("/signup", signup);
router.post("/login", login);
router.post("/otp", sendOtp);

// Authentication status route
router.get("/status", auth, (req, res) => {
  if (req.user) {
    return res.status(200).json({
      isAuthenticated: true,
      user: req.user
    });
  } else {
    return res.status(200).json({
      isAuthenticated: false
    });
  }
});

module.exports = router;
