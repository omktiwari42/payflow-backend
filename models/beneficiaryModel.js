const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Add Beneficiary
|--------------------------------------------------------------------------
*/

async function addBeneficiary(
  userId,
  beneficiaryId,
  nickname
) {
  const result = await pool.query(
    `
    INSERT INTO beneficiaries
    (
      user_id,
      beneficiary_id,
      nickname
    )
    VALUES ($1,$2,$3)
    RETURNING *
    `,
    [
      userId,
      beneficiaryId,
      nickname,
    ]
  );

  return result.rows[0];
}

/*
|--------------------------------------------------------------------------
| Get Beneficiaries
|--------------------------------------------------------------------------
*/

async function getBeneficiaries(userId) {
  const result = await pool.query(
    `
    SELECT
      b.id,
      b.nickname,
      b.created_at,
      u.id AS beneficiary_id,
      u.full_name,
      u.phone,
      u.email
    FROM beneficiaries b
    JOIN users u
      ON u.id = b.beneficiary_id
    WHERE b.user_id = $1
    ORDER BY b.created_at DESC
    `,
    [userId]
  );

  return result.rows;
}

/*
|--------------------------------------------------------------------------
| Delete Beneficiary
|--------------------------------------------------------------------------
*/

async function deleteBeneficiary(id, userId) {
  await pool.query(
    `
    DELETE FROM beneficiaries
    WHERE id = $1
      AND user_id = $2
    `,
    [id, userId]
  );
}

/*
|--------------------------------------------------------------------------
| Find Beneficiary
|--------------------------------------------------------------------------
*/

async function findBeneficiary(
  userId,
  beneficiaryId
) {
  const result = await pool.query(
    `
    SELECT *
    FROM beneficiaries
    WHERE user_id = $1
      AND beneficiary_id = $2
    `,
    [
      userId,
      beneficiaryId,
    ]
  );

  return result.rows[0];
}

module.exports = {
  addBeneficiary,
  getBeneficiaries,
  deleteBeneficiary,
  findBeneficiary,
};