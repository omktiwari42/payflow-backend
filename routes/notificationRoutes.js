const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  list,
  read,
  remove,
  count,
} = require("../controllers/notificationController");

/*
|--------------------------------------------------------------------------
| Notifications
|--------------------------------------------------------------------------
*/

router.get(
  "/",
  authMiddleware,
  list
);

router.get(
  "/count",
  authMiddleware,
  count
);

router.put(
  "/:id/read",
  authMiddleware,
  read
);

router.delete(
  "/:id",
  authMiddleware,
  remove
);

module.exports = router;