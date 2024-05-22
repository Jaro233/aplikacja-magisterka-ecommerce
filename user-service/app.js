const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/user");
require("dotenv").config();

const app = express();
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use("/api/users", userRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

module.exports = app;
