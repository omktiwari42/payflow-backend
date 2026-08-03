const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  list,
  create,
  pay,
  remove,
  history,
  upcoming,
} = require("../controllers/billController");

/*
|--------------------------------------------------------------------------
| Bills
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  list
);

router.get(
  "/history",
  authMiddleware,
  history
);

router.get(
  "/upcoming",
  authMiddleware,
  upcoming
);

router.post(
  "/",
  authMiddleware,
  create
);

router.put(
  "/:id/pay",
  authMiddleware,
  pay
);

router.delete(
  "/:id",
  authMiddleware,
  remove
);

module.exports = router;