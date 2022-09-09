require("dotenv").config();
const redis = require("redis");

const redisClient = redis.createClient({
  host: process.env.REDIS_HOSTNAME,
  port: process.env.REDIS_PORT,
  password: process.env.REDIS_PASSWORD,
});

//redisClient.connect();

redisClient.on("connect", () => {
  console.log("redis client connected");
});

module.exports = redisClient;
