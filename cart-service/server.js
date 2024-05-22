const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const cartRoutes = require("./routes/cart");
require("dotenv").config();

const app = express();

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/cart", cartRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

app.listen(5004, () => {
  console.log("Cart service running on port 5004");
});
