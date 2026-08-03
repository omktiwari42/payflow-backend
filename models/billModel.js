const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get All Bills
|--------------------------------------------------------------------------
*/

async function getBills(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM bills
    WHERE user_id = $1
    ORDER BY due_date ASC
    `,
    [userId]
  );

  return result.rows;
}

/*
|--------------------------------------------------------------------------
| Get Bill By ID
|--------------------------------------------------------------------------
*/

async function getBillById(id, userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM bills
    WHERE id = $1
      AND user_id = $2
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
| Add Bill
|--------------------------------------------------------------------------
*/

async function createBill({
  user_id,
  title,
  category,
  account_number,
  amount,
  due_date,
}) {
  const result = await pool.query(
    `
    INSERT INTO bills
    (
      user_id,
      title,
      category,
      account_number,
      amount,
      due_date
    )
    VALUES ($1,$2,$3,$4,$5,$6)
    RETURNING *
    `,
    [
      user_id,
      title,
      category,
      account_number,
      amount,
      due_date,
    ]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Mark Bill Paid
|--------------------------------------------------------------------------
*/

async function payBill(id, userId) {
  const result = await pool.query(
    `
    UPDATE bills
    SET
      status = 'Paid',
      paid_at = NOW()
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
| Delete Bill
|--------------------------------------------------------------------------
*/

async function deleteBill(id, userId) {
  await pool.query(
    `
    DELETE FROM bills
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
  getBills,
  getBillById,
  createBill,
  payBill,
  deleteBill,
};