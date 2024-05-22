const { Sequelize, DataTypes } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: process.env.DB_HOST,
    dialect: "mysql",
    logging: console.log, // Add logging to see SQL queries
  }
);

const Order = sequelize.define(
  "Order",
  {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    items: {
      type: DataTypes.JSON,
      allowNull: false,
    },
    total: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  },
  {
    timestamps: true,
  }
);

sequelize
  .sync({ alter: true }) // Alter the table to match the model
  .then(() => console.log("Order table synced"))
  .catch((err) => console.error("Error syncing order table", err));

module.exports = Order;
