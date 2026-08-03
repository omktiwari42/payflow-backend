const multer = require("multer");
const path = require("path");
const { v4: uuid } = require("uuid");

/*
|--------------------------------------------------------------------------
| Storage
|--------------------------------------------------------------------------
*/

const storage = multer.diskStorage({
  destination(req, file, cb) {
    if (file.fieldname === "profile") {
      cb(null, "uploads/profile");
    } else {
      cb(null, "uploads/receipts");
    }
  },

  filename(req, file, cb) {
    const extension = path.extname(file.originalname);

    cb(null, `${uuid()}${extension}`);
  },
});

/*
|--------------------------------------------------------------------------
| File Filter
|--------------------------------------------------------------------------
*/

function fileFilter(req, file, cb) {
  const allowed = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "application/pdf",
  ];

  if (!allowed.includes(file.mimetype)) {
    return cb(new Error("Unsupported file type."));
  }

  cb(null, true);
}

/*
|--------------------------------------------------------------------------
| Upload
|--------------------------------------------------------------------------
*/

module.exports = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});