const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  sendOtp,
  verifyOtp,
  completeProfile,
} = require("../controllers/authController");

/*
|--------------------------------------------------------------------------
| Authentication
|--------------------------------------------------------------------------
*/

router.post("/register", register);

router.post("/login", login);

/*
|--------------------------------------------------------------------------
| Phone OTP Authentication
|--------------------------------------------------------------------------
*/

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

/*
|--------------------------------------------------------------------------
| Protected Routes
|--------------------------------------------------------------------------
*/

router.put(
  "/complete-profile",
  authMiddleware,
  completeProfile
);

module.exports = router;