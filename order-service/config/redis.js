const redis = require("redis");
require("dotenv").config();

const redisClient = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
});

(async () => {
  redisClient.on("error", (error) => console.error(`Error : ${error}`));
  redisClient.on("connect", () => {
    console.log("Redis client connected");
  });

  await redisClient.connect();
})();

module.exports = redisClient;
