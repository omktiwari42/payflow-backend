const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get User QR
|--------------------------------------------------------------------------
*/

async function getUserQr(userId) {
  const result = await pool.query(
    `
    SELECT
      id,
      full_name,
      phone,
      email
    FROM users
    WHERE id = $1
    `,
    [userId]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Find User By Phone
|--------------------------------------------------------------------------
*/

async function findUserByPhone(phone) {
  const result = await pool.query(
    `
    SELECT
      id,
      full_name,
      phone,
      wallet_balance
    FROM users
    WHERE phone = $1
    `,
    [phone]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Find User By UPI
|--------------------------------------------------------------------------
*/

async function findUserByUpi(upiId) {
  const result = await pool.query(
    `
    SELECT
      id,
      full_name,
      phone,
      wallet_balance,
      upi_id
    FROM users
    WHERE upi_id = $1
    `,
    [upiId]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Update Wallet
|--------------------------------------------------------------------------
*/

async function updateWallet(userId, amount) {
  await pool.query(
    `
    UPDATE users
    SET wallet_balance = wallet_balance + $1
    WHERE id = $2
    `,
    [
      amount,
      userId,
    ]
  );
}

module.exports = {
  getUserQr,
  findUserByPhone,
  findUserByUpi,
  updateWallet,
};