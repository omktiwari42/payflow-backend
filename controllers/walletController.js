const {
  getWalletByUserId,
  createWallet,
  addMoney,
  deductMoney,
} = require("../models/walletModel");

/*
|--------------------------------------------------------------------------
| Get Wallet
|--------------------------------------------------------------------------
*/

exports.getWallet = async (req, res) => {
  try {
    let wallet = await getWalletByUserId(req.user.id);

    if (!wallet) {
      wallet = await createWallet(req.user.id);
    }

    return res.json({
      success: true,
      wallet,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch wallet.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Add Money
|--------------------------------------------------------------------------
*/

exports.addMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount.",
      });
    }

    let wallet = await getWalletByUserId(req.user.id);

    if (!wallet) {
      wallet = await createWallet(req.user.id);
    }

    wallet = await addMoney(req.user.id, amount);

    return res.json({
      success: true,
      message: "Money added successfully.",
      wallet,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to add money.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Deduct Money
|--------------------------------------------------------------------------
*/

exports.deductMoney = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid amount.",
      });
    }

    let wallet = await getWalletByUserId(req.user.id);

    if (!wallet) {
      return res.status(404).json({
        success: false,
        message: "Wallet not found.",
      });
    }

    if (Number(wallet.balance) < Number(amount)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient balance.",
      });
    }

    wallet = await deductMoney(req.user.id, amount);

    return res.json({
      success: true,
      message: "Money deducted successfully.",
      wallet,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to deduct money.",
    });
  }
};