const { consumeFromQueue } = require("../config/rabbitmq");

const processOrderMessage = (message, io) => {
  const order = JSON.parse(message);
  console.log(`Order received: ${JSON.stringify(order)}`);
  io.emit("orderNotification", order);
};

const processCartMessage = (message, io) => {
  const cartAction = JSON.parse(message);
  console.log(`Cart action received: ${JSON.stringify(cartAction)}`);
  io.emit("cartNotification", cartAction);
};

const processUserMessage = (message, io) => {
  const userAction = JSON.parse(message);
  console.log(`User action received: ${JSON.stringify(userAction)}`);
  io.emit("userNotification", userAction);
};

const startConsuming = (io) => {
  consumeFromQueue("orderQueue", (msg) => processOrderMessage(msg, io));
  consumeFromQueue("cartQueue", (msg) => processCartMessage(msg, io));
  consumeFromQueue("userQueue", (msg) => processUserMessage(msg, io));
};

module.exports = { startConsuming };
