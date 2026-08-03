const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../middleware/uploadMiddleware");

const {
  upload: uploadFile,
  list,
  remove,
} = require("../controllers/uploadController");

/*
|--------------------------------------------------------------------------
| Uploads
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  list
);

router.post(
  "/",
  authMiddleware,
  upload.single("file"),
  uploadFile
);

router.delete(
  "/:id",
  authMiddleware,
  remove
);

module.exports = router;