const pool = require("../config/db");

async function findUserByEmail(email) {
  const result = await pool.query(
    "SELECT * FROM users WHERE email = $1",
    [email]
  );

  return result.rows[0];
}

async function findUserByPhone(phone) {
  const result = await pool.query(
    "SELECT * FROM users WHERE phone = $1",
    [phone]
  );

  return result.rows[0];
}

async function findUserById(id) {
  const result = await pool.query(
    "SELECT * FROM users WHERE id = $1",
    [id]
  );

  return result.rows[0];
}

async function createUser({
  full_name,
  email,
  phone,
  password,
}) {
  const result = await pool.query(
    `
    INSERT INTO users
    (
      full_name,
      email,
      phone,
      password
    )
    VALUES ($1,$2,$3,$4)
    RETURNING
      id,
      full_name,
      email,
      phone,
      wallet_balance,
      created_at
    `,
    [
      full_name,
      email,
      phone,
      password,
    ]
  );

  return result.rows[0];
}

async function updateProfile(
  id,
  full_name,
  email
) {
  const result = await pool.query(
    `
    UPDATE users
    SET
      full_name = $1,
      email = $2
    WHERE id = $3
    RETURNING
      id,
      full_name,
      email,
      phone,
      wallet_balance,
      created_at
    `,
    [
      full_name,
      email,
      id,
    ]
  );

  return result.rows[0];
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserByPhone,
  findUserById,
  updateProfile,
};