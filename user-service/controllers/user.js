const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
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

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign(
        { id: user._id, username: user.username },
        process.env.JWT_SECRET,
        {
          expiresIn: "1h",
        }
      );
      res.cookie("token", token, {
        httpOnly: false,
        sameSite: "Strict",
        secure: process.env.NODE_ENV === "production", // Set to true in production
      });

      // Publish login event to RabbitMQ
      const loginMessage = JSON.stringify({
        event: "user_login",
        user: {
          id: user._id,
          username: user.username,
          timestamp: new Date(),
        },
      });
      await publishToQueue("userQueue", loginMessage);

      res.json({ message: "Logged in successfully", username: user.username });
    } else {
      res.status(401).json({ error: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      username,
      password: hashedPassword,
      email,
    });

    await user.save();

    // Publish registration event to RabbitMQ
    const registerMessage = JSON.stringify({
      event: "user_registration",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        timestamp: new Date(),
      },
    });
    await publishToQueue("userQueue", registerMessage);

    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Error fetching user" });
  }
};
