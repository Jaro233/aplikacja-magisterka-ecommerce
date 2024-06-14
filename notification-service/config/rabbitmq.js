const amqp = require("amqplib");

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://localhost";
const RETRY_INTERVAL = 5000; // 5 seconds

const connectToQueue = async (queue, callback) => {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();
    await channel.assertQueue(queue, { durable: true });
    channel.consume(queue, (msg) => {
      if (msg !== null) {
        callback(msg.content.toString());
        channel.ack(msg);
      }
    });
    console.log(`Listening for messages on queue: ${queue}`);
  } catch (error) {
    console.error(`Error consuming from queue: ${queue}`, error);
    console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
    setTimeout(() => connectToQueue(queue, callback), RETRY_INTERVAL);
  }
};

const consumeFromQueue = (queue, callback) => {
  connectToQueue(queue, callback);
};

module.exports = { consumeFromQueue };
