const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  list,
  create,
  remove,
  search,
} = require("../controllers/contactController");

/*
|--------------------------------------------------------------------------
| Contacts
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  list
);

router.get(
  "/search",
  authMiddleware,
  search
);

router.post(
  "/",
  authMiddleware,
  create
);

router.delete(
  "/:id",
  authMiddleware,
  remove
);

module.exports = router;