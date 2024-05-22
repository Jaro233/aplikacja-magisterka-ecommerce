const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const orderRoutes = require("./routes/order");
require("dotenv").config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/orders", orderRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.listen(5003, () => {
  console.log("Order service running on port 5003");
});

// Global error handler for unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("Unhandled promise rejection:", error);
});
