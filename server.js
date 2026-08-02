require("dotenv").config();

const app = require("./app");
const pool = require("./config/db");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    await pool.query("SELECT NOW()");

    console.log("✅ PostgreSQL Connected");

    app.listen(PORT, () => {
      console.log("====================================");
      console.log("🚀 PayFlow Backend Started");
      console.log(`🌍 Environment : ${process.env.NODE_ENV || "development"}`);
      console.log(`📡 Server      : http://localhost:${PORT}`);
      console.log("====================================");
    });
  } catch (err) {
    console.error("❌ Database Connection Failed");
    console.error(err);
    process.exit(1);
  }
}

startServer();