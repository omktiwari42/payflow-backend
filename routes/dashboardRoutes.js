const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  summary,
} = require("../controllers/dashboardController");

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  summary
);

module.exports = router;
module.exports = router;