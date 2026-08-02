const {
  getNotifications,
  markAsRead,
  deleteNotification,
} = require("../models/notificationModel");

/*
|--------------------------------------------------------------------------
| Get Notifications
|--------------------------------------------------------------------------
*/

exports.list = async (req, res) => {
  try {
    const notifications = await getNotifications(req.user.id);

    return res.json({
      success: true,
      notifications,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch notifications.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Mark Notification As Read
|--------------------------------------------------------------------------
*/

exports.read = async (req, res) => {
  try {
    const notification = await markAsRead(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      notification,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to update notification.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

exports.remove = async (req, res) => {
  try {
    await deleteNotification(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      message: "Notification deleted successfully.",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to delete notification.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Notification Count
|--------------------------------------------------------------------------
*/

exports.count = async (req, res) => {
  try {
    const notifications = await getNotifications(req.user.id);

    const unread = notifications.filter(
      (item) => !item.is_read
    ).length;

    return res.json({
      success: true,
      unread,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch notification count.",
    });
  }
};