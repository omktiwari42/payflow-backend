const bcrypt = require("bcryptjs");

const {
  findUserById,
  findUserByEmail,
  updateProfile,
} = require("../models/userModel");

const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get Profile
|--------------------------------------------------------------------------
*/

exports.getProfile = async (req, res) => {
  try {
    const user = await findUserById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    delete user.password;

    return res.json({
      success: true,
      user,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch profile.",
    });

  }
};

/*
|--------------------------------------------------------------------------
| Update Profile
|--------------------------------------------------------------------------
*/

exports.update = async (req, res) => {
  try {

    const { full_name, email } = req.body;

    if (!full_name) {
      return res.status(400).json({
        success: false,
        message: "Full name is required.",
      });
    }

    if (email) {
      const existing = await findUserByEmail(email);

      if (
        existing &&
        existing.id !== req.user.id
      ) {
        return res.status(400).json({
          success: false,
          message: "Email already in use.",
        });
      }
    }

    const user = await updateProfile(
      req.user.id,
      full_name,
      email || null
    );

    return res.json({
      success: true,
      message: "Profile updated successfully.",
      user,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to update profile.",
    });

  }
};

/*
|--------------------------------------------------------------------------
| Change Password
|--------------------------------------------------------------------------
*/

exports.changePassword = async (req, res) => {
  try {

    const {
      currentPassword,
      newPassword,
    } = req.body;

    const user = await findUserById(req.user.id);

    const valid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!valid) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    const hashed = await bcrypt.hash(
      newPassword,
      10
    );

    await pool.query(
      `
      UPDATE users
      SET password = $1
      WHERE id = $2
      `,
      [
        hashed,
        req.user.id,
      ]
    );

    return res.json({
      success: true,
      message: "Password changed successfully.",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to change password.",
    });

  }
};