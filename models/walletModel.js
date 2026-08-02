const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get Wallet By User ID
|--------------------------------------------------------------------------
*/

async function getWalletByUserId(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM wallets
    WHERE user_id = $1
    `,
    [userId]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Create Wallet
|--------------------------------------------------------------------------
*/

async function createWallet(userId) {
  const result = await pool.query(
    `
    INSERT INTO wallets
    (
      user_id,
      balance
    )
    VALUES ($1,0)
    RETURNING *
    `,
    [userId]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Update Wallet Balance
|--------------------------------------------------------------------------
*/

async function updateWalletBalance(userId, balance) {
  const result = await pool.query(
    `
    UPDATE wallets
    SET balance = $1
    WHERE user_id = $2
    RETURNING *
    `,
    [balance, userId]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Add Money
|--------------------------------------------------------------------------
*/

async function addMoney(userId, amount) {
  const result = await pool.query(
    `
    UPDATE wallets
    SET balance = balance + $1
    WHERE user_id = $2
    RETURNING *
    `,
    [amount, userId]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Deduct Money
|--------------------------------------------------------------------------
*/

async function deductMoney(userId, amount) {
  const result = await pool.query(
    `
    UPDATE wallets
    SET balance = balance - $1
    WHERE user_id = $2
    RETURNING *
    `,
    [amount, userId]
  );

  return result.rows[0];
}

module.exports = {
  getWalletByUserId,
  createWallet,
  updateWalletBalance,
  addMoney,
  deductMoney,
};