const {
  findUserByPhone,
  createUser,
} = require("../models/userModel");

const {
  saveOtp,
  getLatestOtp,
  deleteOtp,
} = require("../models/otpModel");

const jwt = require("jsonwebtoken");

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Enter a valid phone number.",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await deleteOtp(phone);

    await saveOtp(phone, otp, expiresAt);

    // TODO: Replace this with SMS API (Twilio/Fast2SMS/etc.)
    console.log(`OTP for ${phone}: ${otp}`);

    res.json({
      success: true,
      message: "OTP sent successfully.",
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// Verify OTP
exports.verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const record = await getLatestOtp(phone);

    if (!record) {
      return res.status(400).json({
        success: false,
        message: "OTP not found.",
      });
    }

    if (record.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP.",
      });
    }

    if (new Date() > new Date(record.expires_at)) {
      return res.status(400).json({
        success: false,
        message: "OTP expired.",
      });
    }

    let user = await findUserByPhone(phone);

    if (!user) {
      user = await createUser({
        full_name: "",
        email: null,
        phone,
        password: "",
      });
    }

    await deleteOtp(phone);

    const token = jwt.sign(
      {
        id: user.id,
        phone: user.phone,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.json({
      success: true,
      token,
      user,
      isNewUser: !user.full_name,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

// Complete Profile
exports.completeProfile = async (req, res) => {
  res.json({
    success: true,
    message: "Complete profile API coming next.",
  });
};