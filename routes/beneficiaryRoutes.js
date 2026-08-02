const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  add,
  list,
  remove,
} = require("../controllers/beneficiaryController");

/*
|--------------------------------------------------------------------------
| Beneficiaries
|--------------------------------------------------------------------------
*/

router.post(
  "/",
  authMiddleware,
  add
);

router.get(
  "/",
  authMiddleware,
  list
);

router.delete(
  "/:id",
  authMiddleware,
  remove
);

module.exports = router;