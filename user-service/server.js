const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { sequelize } = require("./models");
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

if (process.env.NODE_ENV !== "test") {
  sequelize
    .sync()
    .then(() => {
      app.listen(5001, () => {
        console.log("User service running on port 5001");
      });
    })
    .catch((err) => {
      console.error("Unable to connect to the database:", err);
    });
}

module.exports = app;
