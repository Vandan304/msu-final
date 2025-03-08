import cron from "node-cron";
import { SecretMessage } from "../models/message.js";
import redisClient from "../config/redis.js";

// Runs every hour to delete expired messages
cron.schedule("0 * * * *", async () => {
  try {
    const now = new Date();
    const expiredMessages = await SecretMessage.find({ expiresAt: { $lt: now } });

    // Delete expired messages from Redis
    for (const msg of expiredMessages) {
      await redisClient.del(msg._id.toString());
    }

    // Delete from MongoDB
    await SecretMessage.deleteMany({ expiresAt: { $lt: now } });

    console.log("🗑️ Expired messages deleted");
  } catch (error) {
    console.error("❌ Error deleting expired messages:", error.message);
  }
});
