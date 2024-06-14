const client = require("../config/redis");
const axios = require("axios");
const amqp = require("amqplib");
require("dotenv").config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;

const publishToQueue = async (queue, message) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.sendToQueue(queue, Buffer.from(message));
    console.log(`Message sent to queue: ${queue}`);
  } catch (error) {
    console.error("Error in publishing message:", error);
  }
};

exports.getCart = (req, res) => {
  const userId = req.user.id;
  client.hgetall(userId, async (err, cart) => {
    if (err) {
      console.error("Error fetching cart:", err);
      return res.status(500).json({ error: "Error fetching cart" });
    }
    if (!cart) {
      return res.json([]);
    }

    const productIds = Object.keys(cart);
    const cartItems = [];
    let totalCost = 0;

    for (let productId of productIds) {
      try {
        const response = await axios.get(
          `${process.env.PRODUCT_SERVICE_URL}/api/products/${productId}`
        );
        const product = response.data;
        const quantity = parseInt(cart[productId], 10);
        const itemTotal = product.price * quantity;
        totalCost += itemTotal;
        cartItems.push({
          id: product.id,
          name: product.name,
          description: product.description,
          imageUrl: product.imageUrl,
          price: product.price,
          quantity: quantity,
          itemTotal: itemTotal,
        });
      } catch (error) {
        console.error("Error fetching product details:", error);
        return res
          .status(500)
          .json({ error: "Error fetching product details" });
      }
    }

    res.json({ cartItems, totalCost });
  });
};

exports.addToCart = (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;
    client.hincrby(userId, productId, 1, async (err) => {
      if (err) {
        console.error("Error adding to cart:", err);
        return res.status(500).json({ error: "Error adding to cart" });
      }

      const message = JSON.stringify({ userId, productId, action: "add" });
      await publishToQueue("cartQueue", message);

      res.json({ message: "Product added to cart" });
    });
  } catch (error) {
    console.error("Error in addToCart controller:", error);
    res.status(500).json({ error: "Server error" });
  }
};

exports.removeFromCart = (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;
    client.hdel(userId, productId, async (err) => {
      if (err) {
        console.error("Error removing from cart:", err);
        return res.status(500).json({ error: "Error removing from cart" });
      }

      const message = JSON.stringify({ userId, productId, action: "remove" });
      await publishToQueue("cartQueue", message);

      res.json({ message: "Product removed from cart" });
    });
  } catch (error) {
    console.error("Error in removeFromCart controller:", error);
    res.status(500).json({ error: "Server error" });
  }
};
exports.getCount = (req, res) => {
  const userId = req.user.id;
  client.hgetall(userId, (err, cart) => {
    if (err) {
      console.error("Error fetching cart:", err);
      return res.status(500).json({ error: "Error fetching cart" });
    }
    if (!cart) {
      return res.json({ count: 0 });
    }

    const totalCount = Object.values(cart).reduce(
      (acc, quantity) => acc + parseInt(quantity, 10),
      0
    );
    res.json({ count: totalCount });
  });
};

exports.updateCartQuantity = (req, res) => {
  try {
    const userId = req.user.id;
    const { productId, quantity } = req.body;
    if (quantity <= 0) {
      return res.status(400).json({ error: "Quantity must be greater than 0" });
    }
    client.hset(userId, productId, quantity, async (err) => {
      if (err) {
        console.error("Error updating cart quantity:", err);
        return res.status(500).json({ error: "Error updating cart quantity" });
      }

      const message = JSON.stringify({ userId, productId, action: "update" });
      await publishToQueue("cartQueue", message);

      res.json({ message: "Cart quantity updated successfully" });
    });
  } catch (error) {
    console.error("Error in updateCartQuantity controller:", error);
    res.status(500).json({ error: "Server error" });
  }
};
