const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  getWallet,
  addMoney,
  deductMoney,
} = require("../controllers/walletController");

/*
|--------------------------------------------------------------------------
| Wallet
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  getWallet
);

router.post(
  "/add-money",
  authMiddleware,
  addMoney
);

router.post(
  "/deduct-money",
  authMiddleware,
  deductMoney
);

module.exports = router;