const pool = require("../config/db");

const {
  createTransaction,
} = require("../models/transactionModel");

const {
  getWalletByUserId,
} = require("../models/walletModel");

const {
  findUserByPhone,
} = require("../models/userModel");

/*
|--------------------------------------------------------------------------
| Send Money
|--------------------------------------------------------------------------
*/

exports.sendMoney = async (req, res) => {
  const client = await pool.connect();

  try {
    const { phone, amount, note } = req.body;

    if (!phone || !amount || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: "Invalid request.",
      });
    }

    const receiver = await findUserByPhone(phone);

    if (!receiver) {
      return res.status(404).json({
        success: false,
        message: "Receiver not found.",
      });
    }

    if (receiver.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot send money to yourself.",
      });
    }

    const senderWallet = await getWalletByUserId(req.user.id);

    if (!senderWallet) {
      return res.status(404).json({
        success: false,
        message: "Sender wallet not found.",
      });
    }

    if (Number(senderWallet.balance) < Number(amount)) {
      return res.status(400).json({
        success: false,
        message: "Insufficient wallet balance.",
      });
    }

    await client.query("BEGIN");

    await client.query(
      `
      UPDATE wallets
      SET balance = balance - $1
      WHERE user_id = $2
      `,
      [amount, req.user.id],
    );

    await client.query(
      `
      INSERT INTO wallets(user_id,balance)
      VALUES($1,0)
      ON CONFLICT(user_id)
      DO NOTHING
      `,
      [receiver.id],
    );

    await client.query(
      `
      UPDATE wallets
      SET balance = balance + $1
      WHERE user_id = $2
      `,
      [amount, receiver.id],
    );

    const transaction = await createTransaction({
      sender_id: req.user.id,
      receiver_id: receiver.id,
      amount,
      transaction_type: "SEND",
      note,
    });

    await client.query("COMMIT");

    return res.json({
      success: true,
      message: "Money sent successfully.",
      transaction,
    });
  } catch (err) {
    await client.query("ROLLBACK");

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Transaction failed.",
    });
  } finally {
    client.release();
  }
};

/*
|--------------------------------------------------------------------------
| Transaction History
|--------------------------------------------------------------------------
*/

exports.history = async (req, res) => {
  try {
    const result = await pool.query(
      `
      SELECT
        t.id,
        t.amount,
        t.note,
        t.transaction_type,
        t.created_at,
        'SUCCESS' AS status,

        sender.full_name   AS sender_name,
        sender.phone       AS sender_phone,

        receiver.full_name AS receiver_name,
        receiver.phone     AS receiver_phone

      FROM transactions t

      JOIN users sender
        ON sender.id = t.sender_id

      JOIN users receiver
        ON receiver.id = t.receiver_id

      WHERE
        t.sender_id = $1
        OR t.receiver_id = $1

      ORDER BY t.created_at DESC
      `,
      [req.user.id],
    );

    return res.json({
      success: true,
      transactions: result.rows,
    });
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch transactions.",
    });
  }
};