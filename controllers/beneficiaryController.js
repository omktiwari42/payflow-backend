const {
  addBeneficiary,
  getBeneficiaries,
  deleteBeneficiary,
  findBeneficiary,
} = require("../models/beneficiaryModel");

const {
  findUserByPhone,
} = require("../models/userModel");

/*
|--------------------------------------------------------------------------
| Add Beneficiary
|--------------------------------------------------------------------------
*/

exports.add = async (req, res) => {
  try {
    const { phone, nickname } = req.body;

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Phone number is required.",
      });
    }

    const user = await findUserByPhone(phone);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found.",
      });
    }

    if (user.id === req.user.id) {
      return res.status(400).json({
        success: false,
        message: "You cannot add yourself.",
      });
    }

    const exists = await findBeneficiary(
      req.user.id,
      user.id
    );

    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Beneficiary already exists.",
      });
    }

    const beneficiary = await addBeneficiary(
      req.user.id,
      user.id,
      nickname || user.full_name
    );

    return res.status(201).json({
      success: true,
      message: "Beneficiary added successfully.",
      beneficiary,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to add beneficiary.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Get Beneficiaries
|--------------------------------------------------------------------------
*/

exports.list = async (req, res) => {
  try {

    const beneficiaries = await getBeneficiaries(req.user.id);

    return res.json({
      success: true,
      beneficiaries,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch beneficiaries.",
    });

  }
};

/*
|--------------------------------------------------------------------------
| Delete Beneficiary
|--------------------------------------------------------------------------
*/

exports.remove = async (req, res) => {
  try {

    await deleteBeneficiary(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      message: "Beneficiary deleted successfully.",
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to delete beneficiary.",
    });

  }
};