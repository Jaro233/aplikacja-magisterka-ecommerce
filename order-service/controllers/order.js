const Order = require("../models/order");
const axios = require("axios");
const redisClient = require("../config/redis");
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

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({ where: { userId: req.user.id } });
    const detailedOrders = await Promise.all(
      orders.map(async (order) => {
        const detailedItems = await Promise.all(
          order.items.map(async (item) => {
            const response = await axios.get(
              `${process.env.PRODUCT_SERVICE_URL}/api/products/${item.productId}`
            );
            const product = response.data;
            return {
              ...item,
              name: product.name,
              description: product.description,
              imageUrl: product.imageUrl,
              price: product.price,
            };
          })
        );
        return {
          ...order.toJSON(),
          items: detailedItems,
        };
      })
    );
    res.json(detailedOrders);
  } catch (error) {
    console.error("Error fetching orders:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.createOrder = async (req, res) => {
  try {
    const { items } = req.body;
    let total = 0;

    for (let item of items) {
      const response = await axios.get(
        `${process.env.PRODUCT_SERVICE_URL}/api/products/${item.productId}`
      );
      const product = response.data;
      total += product.price * item.quantity;
    }

    const order = await Order.create({
      userId: req.user.id,
      items,
      total,
    });

    await redisClient.del(req.user.id.toString());

    await publishToQueue("orderQueue", JSON.stringify(order));

    res.status(201).json(order);
  } catch (error) {
    console.error("Error creating order:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
