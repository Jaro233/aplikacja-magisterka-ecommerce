const express = require("express");
const router = express.Router();
const { getOrders, createOrder } = require("../controllers/order");
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, getOrders);
router.post("/", verifyToken, createOrder);

module.exports = router;
