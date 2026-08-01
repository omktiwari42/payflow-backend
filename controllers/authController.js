const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const {
  createUser,
  findUserByEmail,
  findUserByPhone,
  updateProfile,
} = require("../models/userModel");
const {
  saveOtp,
  getLatestOtp,
  deleteOtp,
} = require("../models/otpModel");

/*
|--------------------------------------------------------------------------
| Register
|--------------------------------------------------------------------------
*/

exports.register = async (req, res) => {
  try {
    const { full_name, email, phone, password } = req.body;

    if (!full_name || !phone || !password) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing.",
      });
    }

    const existingPhone = await findUserByPhone(phone);

    if (existingPhone) {
      return res.status(400).json({
        success: false,
        message: "Phone number already registered.",
      });
    }

    if (email) {
      const existingEmail = await findUserByEmail(email);

      if (existingEmail) {
        return res.status(400).json({
          success: false,
          message: "Email already registered.",
        });
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await createUser({
      full_name,
      email,
      phone,
      password: hashedPassword,
    });

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    res.status(201).json({
      success: true,
      message: "Registration successful.",
      token,
      user,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Login (Phone OR Email)
|--------------------------------------------------------------------------
*/

exports.login = async (req, res) => {
  try {
    const { identifier, password } = req.body;

    let user;

    if (identifier.includes("@")) {
      user = await findUserByEmail(identifier);
    } else {
      user = await findUserByPhone(identifier);
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const validPassword = await bcrypt.compare(
      password,
      user.password
    );

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials.",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    delete user.password;

    res.json({
      success: true,
      token,
      user,
    });

  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Send OTP
|--------------------------------------------------------------------------
*/

exports.sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    if (!phone || phone.length !== 10) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number.",
      });
    }

    const otp = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await deleteOtp(phone);

    await saveOtp(phone, otp, expiresAt);

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

/*
|--------------------------------------------------------------------------
| Verify OTP
|--------------------------------------------------------------------------
*/

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

    await deleteOtp(phone);

    const user = await findUserByPhone(phone);

    // New User
    if (!user) {
      return res.json({
        success: true,
        isNewUser: true,
        message: "OTP verified successfully.",
      });
    }

    // Existing User
    const token = jwt.sign(
      {
        id: user.id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    delete user.password;

    return res.json({
      success: true,
      isNewUser: false,
      token,
      user,
      message: "OTP verified successfully.",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};
/*
|--------------------------------------------------------------------------
| Complete Profile
|--------------------------------------------------------------------------
*/

exports.completeProfile = async (req, res) => {
  try {
    const { full_name, email } = req.body;

    if (!full_name) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    const user = await updateProfile(
      req.user.id,
      full_name,
      email || null
    );

    return res.json({
      success: true,
      message: "Profile completed successfully.",
      user,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Server error.",
    });
  }
};