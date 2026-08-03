const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  generate,
  scan,
  pay,
} = require("../controllers/qrController");

/*
|--------------------------------------------------------------------------
| QR Payments
|--------------------------------------------------------------------------
*/

router.get(
  "/generate",
  authMiddleware,
  generate
);

router.post(
  "/scan",
  authMiddleware,
  scan
);

router.post(
  "/pay",
  authMiddleware,
  pay
);

module.exports = router;