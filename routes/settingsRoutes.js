const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  get,
  update,
  logoutAll,
} = require("../controllers/settingsController");

/*
|--------------------------------------------------------------------------
| Settings
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  get
);

router.put(
  "/",
  authMiddleware,
  update
);

router.post(
  "/logout-all",
  authMiddleware,
  logoutAll
);

module.exports = router;