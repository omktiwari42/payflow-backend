const express = require("express");

const router = express.Router();

const {
  sendOtp,
  verifyOtp,
  completeProfile,
} = require("../controllers/authController");

const authMiddleware = require("../middleware/authMiddleware");

// Send OTP
router.post("/send-otp", sendOtp);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Complete profile (Protected)
router.post(
  "/complete-profile",
  authMiddleware,
  completeProfile
);

module.exports = router;