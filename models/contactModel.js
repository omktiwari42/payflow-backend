const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Get Contacts
|--------------------------------------------------------------------------
*/

async function getContacts(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM contacts
    WHERE user_id = $1
    ORDER BY full_name ASC
    `,
    [userId]
  );

  return result.rows;
}

/*
|--------------------------------------------------------------------------
| Add Contact
|--------------------------------------------------------------------------
*/

async function addContact({
  user_id,
  full_name,
  phone,
  upi_id,
}) {
  const result = await pool.query(
    `
    INSERT INTO contacts
    (
      user_id,
      full_name,
      phone,
      upi_id
    )
    VALUES ($1,$2,$3,$4)
    RETURNING *
    `,
    [
      user_id,
      full_name,
      phone,
      upi_id,
    ]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Delete Contact
|--------------------------------------------------------------------------
*/

async function deleteContact(id, userId) {
  await pool.query(
    `
    DELETE FROM contacts
    WHERE id = $1
      AND user_id = $2
    `,
    [
      id,
      userId,
    ]
  );
}

/*
|--------------------------------------------------------------------------
| Search Contacts
|--------------------------------------------------------------------------
*/

async function searchContacts(userId, keyword) {
  const result = await pool.query(
    `
    SELECT *
    FROM contacts
    WHERE user_id = $1
      AND (
        full_name ILIKE $2
        OR phone ILIKE $2
        OR upi_id ILIKE $2
      )
    ORDER BY full_name
    `,
    [
      userId,
      `%${keyword}%`,
    ]
  );

  return result.rows;
}

module.exports = {
  getContacts,
  addContact,
  deleteContact,
  searchContacts,
};