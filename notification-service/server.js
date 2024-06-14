const express = require("express");
const http = require("http");
const cors = require("cors");
const socketIo = require("socket.io");
const { startConsuming } = require("./controllers/notification");
require("dotenv").config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  path: "/api/notifications",
  cors: {
    origin: true,
    credentials: true,
  },
});

const PORT = process.env.PORT || 5005;

app.use(cors({ origin: true, credentials: true }));

app.get("/health", (req, res) => {
  res.status(200).json({ status: "UP" });
});

io.on("connection", (socket) => {
  console.log("A user connected");
  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

server.listen(PORT, () => {
  console.log(`Notification service running on port ${PORT}`);
  startConsuming(io);
});

module.exports = { io };
