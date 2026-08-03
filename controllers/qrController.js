const {
  getUserQr,
  findUserByPhone,
  findUserByUpi,
  updateWallet,
} = require("../models/qrModel");

const {
  createTransaction,
} = require("../models/transactionModel");

/*
|--------------------------------------------------------------------------
| Generate QR
|--------------------------------------------------------------------------
*/

exports.generate = async (req, res) => {
  try {
    const user = await getUserQr(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    const qrData = {
      id: user.id,
      name: user.full_name,
      phone: user.phone,
      email: user.email,
    };

    return res.json({
      success: true,
      qr: qrData,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to generate QR.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Scan QR
|--------------------------------------------------------------------------
*/

exports.scan = async (req, res) => {
  try {
    const { phone, upi_id } = req.body;

    let user = null;

    if (phone) {
      user = await findUserByPhone(phone);
    }

    if (!user && upi_id) {
      user = await findUserByUpi(upi_id);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Recipient not found.",
      });
    }

    return res.json({
      success: true,
      recipient: user,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to scan QR.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Pay Through QR
|--------------------------------------------------------------------------
*/

exports.pay = async (req, res) => {
  try {
    const {
      receiver_id,
      amount,
    } = req.body;

    if (!receiver_id || !amount) {
      return res.status(400).json({
        success: false,
        message: "Receiver and amount are required.",
      });
    }

    await updateWallet(req.user.id, -amount);

    await updateWallet(receiver_id, amount);

    await createTransaction({
      sender_id: req.user.id,
      receiver_id,
      amount,
      type: "QR Payment",
    });

    return res.json({
      success: true,
      message: "QR payment successful.",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "QR payment failed.",
    });
  }
};