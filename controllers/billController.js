const {
  getBills,
  getBillById,
  createBill,
  payBill,
  deleteBill,
} = require("../models/billModel");

/*
|--------------------------------------------------------------------------
| Get All Bills
|--------------------------------------------------------------------------
*/

exports.list = async (req, res) => {
  try {
    const bills = await getBills(req.user.id);

    return res.json({
      success: true,
      bills,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch bills.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Add Bill
|--------------------------------------------------------------------------
*/

exports.create = async (req, res) => {
  try {
    const {
      title,
      category,
      account_number,
      amount,
      due_date,
    } = req.body;

    if (
      !title ||
      !category ||
      !account_number ||
      !amount ||
      !due_date
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required.",
      });
    }

    const bill = await createBill({
      user_id: req.user.id,
      title,
      category,
      account_number,
      amount,
      due_date,
    });

    return res.status(201).json({
      success: true,
      message: "Bill added successfully.",
      bill,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to create bill.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Pay Bill
|--------------------------------------------------------------------------
*/

exports.pay = async (req, res) => {
  try {
    const bill = await getBillById(
      req.params.id,
      req.user.id,
    );

    if (!bill) {
      return res.status(404).json({
        success: false,
        message: "Bill not found.",
      });
    }

    const updatedBill = await payBill(
      req.params.id,
      req.user.id,
    );

    return res.json({
      success: true,
      message: "Bill paid successfully.",
      bill: updatedBill,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to pay bill.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Bill
|--------------------------------------------------------------------------
*/

exports.remove = async (req, res) => {
  try {
    await deleteBill(
      req.params.id,
      req.user.id,
    );

    return res.json({
      success: true,
      message: "Bill deleted successfully.",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to delete bill.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Upcoming Bills
|--------------------------------------------------------------------------
*/

exports.upcoming = async (req, res) => {
  try {
    const bills = await getBills(req.user.id);

    const upcomingBills = bills.filter(
      (bill) => bill.status !== "Paid",
    );

    return res.json({
      success: true,
      bills: upcomingBills,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch upcoming bills.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Bill History
|--------------------------------------------------------------------------
*/

exports.history = async (req, res) => {
  try {
    const bills = await getBills(req.user.id);

    const history = bills.filter(
      (bill) => bill.status === "Paid",
    );

    return res.json({
      success: true,
      bills: history,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch bill history.",
    });
  }
};