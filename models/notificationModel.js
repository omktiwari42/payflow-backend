const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Create Notification
|--------------------------------------------------------------------------
*/

async function createNotification({
  user_id,
  title,
  message,
}) {
  const result = await pool.query(
    `
    INSERT INTO notifications
    (
      user_id,
      title,
      message
    )
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [
      user_id,
      title,
      message,
    ]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Get Notifications
|--------------------------------------------------------------------------
*/

async function getNotifications(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM notifications
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

/*
|--------------------------------------------------------------------------
| Mark As Read
|--------------------------------------------------------------------------
*/

async function markAsRead(id, userId) {
  const result = await pool.query(
    `
    UPDATE notifications
    SET is_read = TRUE
    WHERE id = $1
      AND user_id = $2
    RETURNING *
    `,
    [
      id,
      userId,
    ]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Delete Notification
|--------------------------------------------------------------------------
*/

async function deleteNotification(id, userId) {
  await pool.query(
    `
    DELETE FROM notifications
    WHERE id = $1
      AND user_id = $2
    `,
    [
      id,
      userId,
    ]
  );
}

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  deleteNotification,
};