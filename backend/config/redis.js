import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const redisClient = createClient({
  socket: {
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
  },
  password: process.env.REDIS_PASSWORD || undefined,
});

redisClient.on("error", (err) => console.error("❌ Redis Connection Error:", err));

(async () => {
  try {
    await redisClient.connect();
    console.log("✅ Connected to Redis Successfully!");
  } catch (error) {
    console.error("❌ Redis Connection Failed:", error);
    process.exit(1);
  }
})();

export default redisClient;
