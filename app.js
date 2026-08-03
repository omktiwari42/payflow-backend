require("dotenv").config();

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const compression = require("compression");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const walletRoutes = require("./routes/walletRoutes");
const transactionRoutes = require("./routes/transactionRoutes");
const beneficiaryRoutes = require("./routes/beneficiaryRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const profileRoutes = require("./routes/profileRoutes");
const contactRoutes = require("./routes/contactRoutes");
const billRoutes = require("./routes/billRoutes");
const qrRoutes = require("./routes/qrRoutes");
const searchRoutes = require("./routes/searchRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const settingsRoutes = require("./routes/settingsRoutes");

const app = express();

/*
|--------------------------------------------------------------------------
| Security Middleware
|--------------------------------------------------------------------------
*/

app.use(helmet());

app.use(compression());

app.use(
  cors({
    origin: "*",
    credentials: true,
  })
);

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

/*
|--------------------------------------------------------------------------
| Rate Limiter
|--------------------------------------------------------------------------
*/

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use("/api", limiter);

/*
|--------------------------------------------------------------------------
| Static Files
|--------------------------------------------------------------------------
*/

app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

/*
|--------------------------------------------------------------------------
| Health Routes
|--------------------------------------------------------------------------
*/

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 PayFlow Backend API Running",
    version: "1.0.0",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "OK",
    uptime: process.uptime(),
    timestamp: new Date(),
  });
});

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

app.use("/api/auth", authRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/transactions", transactionRoutes);
app.use("/api/beneficiaries", beneficiaryRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/contacts", contactRoutes);
app.use("/api/bills", billRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/uploads", uploadRoutes);
app.use("/api/settings", settingsRoutes);

/*
|--------------------------------------------------------------------------
| 404 Handler
|--------------------------------------------------------------------------
*/

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found.",
  });
});

/*
|--------------------------------------------------------------------------
| Global Error Handler
|--------------------------------------------------------------------------
*/

app.use((err, req, res, next) => {
  console.error(err);

  res.status(500).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

module.exports = app;