const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Global Search
|--------------------------------------------------------------------------
*/

async function globalSearch(userId, keyword) {
  const search = `%${keyword}%`;

  const contacts = await pool.query(
    `
    SELECT
      id,
      full_name AS name,
      phone,
      'contact' AS type
    FROM contacts
    WHERE user_id = $1
      AND (
        full_name ILIKE $2
        OR phone ILIKE $2
        OR upi_id ILIKE $2
      )
    `,
    [userId, search]
  );

  const beneficiaries = await pool.query(
    `
    SELECT
      id,
      full_name AS name,
      account_number,
      'beneficiary' AS type
    FROM beneficiaries
    WHERE user_id = $1
      AND full_name ILIKE $2
    `,
    [userId, search]
  );

  const bills = await pool.query(
    `
    SELECT
      id,
      title AS name,
      amount,
      'bill' AS type
    FROM bills
    WHERE user_id = $1
      AND title ILIKE $2
    `,
    [userId, search]
  );

  const transactions = await pool.query(
    `
    SELECT
      id,
      amount,
      type,
      created_at
    FROM transactions
    WHERE sender_id = $1
       OR receiver_id = $1
    ORDER BY created_at DESC
    LIMIT 10
    `,
    [userId]
  );

  const users = await pool.query(
    `
    SELECT
      id,
      full_name AS name,
      phone,
      email,
      'user' AS type
    FROM users
    WHERE
      full_name ILIKE $1
      OR phone ILIKE $1
      OR email ILIKE $1
    LIMIT 10
    `,
    [search]
  );

  return {
    contacts: contacts.rows,
    beneficiaries: beneficiaries.rows,
    bills: bills.rows,
    transactions: transactions.rows,
    users: users.rows,
  };
}

module.exports = {
  globalSearch,
};