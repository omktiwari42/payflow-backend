const pool = require("../config/db");

async function saveOtp(phone, otp, expiresAt) {
  const result = await pool.query(
    `
    INSERT INTO otp_codes
    (
      phone,
      otp,
      expires_at
    )
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [phone, otp, expiresAt]
  );

  return result.rows[0];
}

async function getLatestOtp(phone) {
  const result = await pool.query(
    `
    SELECT *
    FROM otp_codes
    WHERE phone = $1
    ORDER BY created_at DESC
    LIMIT 1
    `,
    [phone]
  );

  return result.rows[0];
}

async function deleteOtp(phone) {
  await pool.query(
    `
    DELETE FROM otp_codes
    WHERE phone = $1
    `,
    [phone]
  );
}

module.exports = {
  saveOtp,
  getLatestOtp,
  deleteOtp,
};