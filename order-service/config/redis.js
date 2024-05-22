const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASS,
});

(async () => {
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  redisClient.on("connect", () => {
    console.log("Redis client connected");
  });

  await redisClient.connect();
})();

module.exports = redisClient;
