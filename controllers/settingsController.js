const {
  getSettings,
  createDefaultSettings,
  updateSettings,
} = require("../models/settingsModel");

/*
|--------------------------------------------------------------------------
| Get Settings
|--------------------------------------------------------------------------
*/

exports.get = async (req, res) => {
  try {
    let settings = await getSettings(req.user.id);

    if (!settings) {
      settings = await createDefaultSettings(req.user.id);
    }

    return res.json({
      success: true,
      settings,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch settings.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Update Settings
|--------------------------------------------------------------------------
*/

exports.update = async (req, res) => {
  try {
    const {
      theme,
      language,
      notifications_enabled,
      biometric_enabled,
      pin_enabled,
    } = req.body;

    let settings = await getSettings(req.user.id);

    if (!settings) {
      await createDefaultSettings(req.user.id);
    }

    settings = await updateSettings(req.user.id, {
      theme,
      language,
      notifications_enabled,
      biometric_enabled,
      pin_enabled,
    });

    return res.json({
      success: true,
      message: "Settings updated successfully.",
      settings,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to update settings.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Logout All Devices
|--------------------------------------------------------------------------
*/

exports.logoutAll = async (req, res) => {
  try {
    // JWT blacklist / refresh token logic
    // will be implemented in Phase 2.

    return res.json({
      success: true,
      message: "Logged out from all devices.",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to logout.",
    });
  }
};