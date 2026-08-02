const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getProfile,
  update,
  changePassword,
} = require("../controllers/profileController");

/*
|--------------------------------------------------------------------------
| Profile
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  getProfile
);

router.put(
  "/",
  authMiddleware,
  update
);

router.put(
  "/change-password",
  authMiddleware,
  changePassword
);

module.exports = router;