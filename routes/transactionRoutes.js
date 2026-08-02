const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  sendMoney,
  history,
} = require("../controllers/transactionController");

/*
|--------------------------------------------------------------------------
| Transactions
|--------------------------------------------------------------------------
*/

router.post(
  "/send",
  authMiddleware,
  sendMoney
);

router.get(
  "/history",
  authMiddleware,
  history
);

module.exports = router;