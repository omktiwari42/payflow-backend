const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Create Transaction
|--------------------------------------------------------------------------
*/

async function createTransaction({
  sender_id,
  receiver_id,
  amount,
  transaction_type,
  note,
}) {
  const result = await pool.query(
    `
    INSERT INTO transactions
    (
      sender_id,
      receiver_id,
      amount,
      transaction_type,
      note
    )
    VALUES ($1,$2,$3,$4,$5)
    RETURNING *
    `,
    [
      sender_id,
      receiver_id,
      amount,
      transaction_type,
      note,
    ]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Get User Transactions
|--------------------------------------------------------------------------
*/

async function getTransactions(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM transactions
    WHERE sender_id = $1
       OR receiver_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

/*
|--------------------------------------------------------------------------
| Get Transaction By ID
|--------------------------------------------------------------------------
*/

async function getTransactionById(id) {
  const result = await pool.query(
    `
    SELECT *
    FROM transactions
    WHERE id = $1
    `,
    [id]
  );

  return result.rows[0];
}

module.exports = {
  createTransaction,
  getTransactions,
  getTransactionById,
};