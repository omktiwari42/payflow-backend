const fs = require("fs");

const {
  saveUpload,
  getUploads,
  getUpload,
  deleteUpload,
} = require("../models/uploadModel");

/*
|--------------------------------------------------------------------------
| Upload File
|--------------------------------------------------------------------------
*/

exports.upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "No file uploaded.",
      });
    }

    const upload = await saveUpload({
      user_id: req.user.id,
      transaction_id: req.body.transaction_id || null,
      file_name: req.file.filename,
      original_name: req.file.originalname,
      file_path: req.file.path,
      file_type: req.file.mimetype,
      file_size: req.file.size,
    });

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully.",
      upload,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to upload file.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| List Uploads
|--------------------------------------------------------------------------
*/

exports.list = async (req, res) => {
  try {
    const uploads = await getUploads(req.user.id);

    return res.json({
      success: true,
      uploads,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch uploads.",
    });
  }
};

/*
|--------------------------------------------------------------------------
| Delete Upload
|--------------------------------------------------------------------------
*/

exports.remove = async (req, res) => {
  try {
    const upload = await getUpload(
      req.params.id,
      req.user.id
    );

    if (!upload) {
      return res.status(404).json({
        success: false,
        message: "File not found.",
      });
    }

    if (fs.existsSync(upload.file_path)) {
      fs.unlinkSync(upload.file_path);
    }

    await deleteUpload(
      req.params.id,
      req.user.id
    );

    return res.json({
      success: true,
      message: "File deleted successfully.",
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: "Unable to delete file.",
    });
  }
};