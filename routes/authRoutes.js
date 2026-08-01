const express = require("express");

const {
  register,
  login,
  sendOtp,
  verifyOtp,
} = require("../controllers/authController");

const router = express.Router();

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

module.exports = router;