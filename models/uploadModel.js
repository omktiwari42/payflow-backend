const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Save Upload
|--------------------------------------------------------------------------
*/

async function saveUpload({
  user_id,
  transaction_id,
  file_name,
  original_name,
  file_path,
  file_type,
  file_size,
}) {
  const result = await pool.query(
    `
    INSERT INTO uploads
    (
      user_id,
      transaction_id,
      file_name,
      original_name,
      file_path,
      file_type,
      file_size
    )
    VALUES ($1,$2,$3,$4,$5,$6,$7)
    RETURNING *
    `,
    [
      user_id,
      transaction_id,
      file_name,
      original_name,
      file_path,
      file_type,
      file_size,
    ]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Get User Uploads
|--------------------------------------------------------------------------
*/

async function getUploads(userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM uploads
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

/*
|--------------------------------------------------------------------------
| Get Upload By ID
|--------------------------------------------------------------------------
*/

async function getUpload(id, userId) {
  const result = await pool.query(
    `
    SELECT *
    FROM uploads
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
| Delete Upload
|--------------------------------------------------------------------------
*/

async function deleteUpload(id, userId) {
  await pool.query(
    `
    DELETE FROM uploads
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
  saveUpload,
  getUploads,
  getUpload,
  deleteUpload,
};