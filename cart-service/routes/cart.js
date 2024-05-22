const express = require("express");
const router = express.Router();
const {
  getCart,
  addToCart,
  removeFromCart,
  getCount,
  updateCartQuantity,
} = require("../controllers/cart");
const { verifyToken } = require("../middleware/auth");

router.get("/", verifyToken, getCart);
router.post("/", verifyToken, addToCart); // Ensure this line is correct
router.delete("/:productId", verifyToken, removeFromCart);
router.get("/count", verifyToken, getCount);
router.put("/count", verifyToken, updateCartQuantity);

module.exports = router;
