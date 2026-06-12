require("dotenv").config();

// This project uses CommonJS, so dependencies are loaded with require().
const { createClient } = require("redis");

const redisClient = createClient({
    // REDIS_URL can point to another server; localhost is used during development.
    url: process.env.REDIS_URL,

    // Redis 7 supports RESP3, which is also the protocol expected by redis@6.
    // Setting it explicitly documents the server requirement for this project.
    RESP: 3
});

// Redis emits connection/runtime errors through this event.
redisClient.on("error", (error) => {
    console.error("Redis client error:", error);
});

// Start the connection once when this module is loaded.
redisClient.connect().catch((error) => {
    console.error("Failed to connect to Redis:", error);
});

// Other CommonJS files can access this shared client with require("./redis_config").
module.exports = redisClient;
