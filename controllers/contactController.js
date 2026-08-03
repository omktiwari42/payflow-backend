const {
  getContacts,
  addContact,
  deleteContact,
  searchContacts,
} = require("../models/contactModel");

/*
|--------------------------------------------------------------------------
| Get Contacts
|--------------------------------------------------------------------------
*/

exports.list = async (req, res) => {
  try {
    const contacts = await getContacts(req.user.id);

    return res.json({
      success: true,
      contacts,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch contacts.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Add Contact
|--------------------------------------------------------------------------
*/

exports.create = async (req, res) => {
  try {
    const {
      full_name,
      phone,
      upi_id,
    } = req.body;

    if (!full_name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Full name and phone are required.",
      });
    }

    const contact = await addContact({
      user_id: req.user.id,
      full_name,
      phone,
      upi_id,
    });

    return res.status(201).json({
      success: true,
      message: "Contact added successfully.",
      contact,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to add contact.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Contact
|--------------------------------------------------------------------------
*/

exports.remove = async (req, res) => {
  try {
    await deleteContact(
      req.params.id,
      req.user.id,
    );

    return res.json({
      success: true,
      message: "Contact deleted successfully.",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to delete contact.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Search Contacts
|--------------------------------------------------------------------------
*/

exports.search = async (req, res) => {
  try {
    const keyword = req.query.q || "";

    const contacts = await searchContacts(
      req.user.id,
      keyword,
    );

    return res.json({
      success: true,
      contacts,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to search contacts.",
    });
  }
};