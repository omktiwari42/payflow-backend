const express = require("express");

const authMiddleware = require("../middleware/authMiddleware");

const {
  register,
  login,
  sendOtp,
  verifyOtp,
  completeProfile,
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

/*
|--------------------------------------------------------------------------
| Complete Profile
|--------------------------------------------------------------------------
*/

router.post(
  "/complete-profile",
  authMiddleware,
  completeProfile
);

module.exports = router;