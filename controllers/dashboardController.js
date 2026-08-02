const pool = require("../config/db");

/*
|--------------------------------------------------------------------------
| Dashboard Summary
|--------------------------------------------------------------------------
*/

exports.summary = async (req, res) => {
  try {
    const userId = req.user.id;

    const wallet = await pool.query(
      `
      SELECT balance
      FROM wallets
      WHERE user_id = $1
      `,
      [userId]
    );

    const sent = await pool.query(
      `
      SELECT COALESCE(SUM(amount),0) total
      FROM transactions
      WHERE sender_id = $1
      `,
      [userId]
    );

    const received = await pool.query(
      `
      SELECT COALESCE(SUM(amount),0) total
      FROM transactions
      WHERE receiver_id = $1
      `,
      [userId]
    );

    const transactionCount = await pool.query(
      `
      SELECT COUNT(*) total
      FROM transactions
      WHERE sender_id = $1
         OR receiver_id = $1
      `,
      [userId]
    );

    const recentTransactions = await pool.query(
      `
      SELECT *
      FROM transactions
      WHERE sender_id = $1
         OR receiver_id = $1
      ORDER BY created_at DESC
      LIMIT 5
      `,
      [userId]
    );

    return res.json({
      success: true,
      summary: {
        walletBalance:
          wallet.rows[0]?.balance || 0,

        totalSent:
          sent.rows[0].total,

        totalReceived:
          received.rows[0].total,

        totalTransactions:
          Number(transactionCount.rows[0].total),

        recentTransactions:
          recentTransactions.rows,
      },
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to load dashboard.",
    });

  }
};