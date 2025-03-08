import { SecretMessage } from "../models/message.js";
import bcrypt from "bcryptjs";
import redisClient from "../config/redis.js";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

// ✅ POST: Create a Secret Message & Generate a Shareable Link
export const createSecretMessage = async (req, res) => {
  try {
    const { message, password } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    // Hash password if provided
    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    // Generate a unique key
    const key = crypto.randomBytes(8).toString("hex");

    // Create and save in MongoDB
    const newMessage = new SecretMessage({ message, password: hashedPassword, key });
    await newMessage.save();

    // Store in Redis (expires in 24 hours)
    const messageData = { key, message, password: hashedPassword };
    await redisClient.setEx(newMessage._id.toString(), 86400, JSON.stringify(messageData));

    // ✅ Generate Shareable Link (Fixing `undefined`)
    if (!process.env.FRONTEND_URL) {
      console.error("⚠️ FRONTEND_URL is not set in the environment variables.");
      return res.status(500).json({ error: "Server Configuration Error" });
    }

    const sharableLink = `${process.env.FRONTEND_URL}/secret/${newMessage._id}`;

    res.status(201).json({
      message: "Secret message created successfully!",
      sharableLink, // ✅ Send sharable link to user
    });
  } catch (error) {
    console.error("❌ Error creating message:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ GET: Retrieve & Delete a Secret Message (One-Time Read)
// ✅ GET: Retrieve & Delete a Secret Message (One-Time Read)
export const getSecretMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.query; // Removed `key` validation (not needed)

    // Validate ID format (MongoDB ObjectId)
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ error: "Invalid message ID format" });
    }

    // ✅ 1. Try fetching from Redis first
    let secretMessage = await redisClient.get(id);
    if (secretMessage) {
      secretMessage = JSON.parse(secretMessage);
    } else {
      // ✅ 2. Fetch from MongoDB if not found in Redis
      secretMessage = await SecretMessage.findById(id);
      if (!secretMessage) return res.status(404).json({ error: "Message not found or already deleted" });
    }

    // ✅ 3. Validate password if required
    if (secretMessage.password) {
      if (!password) return res.status(401).json({ error: "Password required" });
      const isMatch = await bcrypt.compare(password, secretMessage.password);
      if (!isMatch) return res.status(403).json({ error: "Incorrect password" });
    }

    const messageContent = secretMessage.message;

    // ✅ 4. Debug Delete Operation
    const mongoDeleteResult = await SecretMessage.findByIdAndDelete(id);
    const redisDeleteResult = await redisClient.del(id);

    if (!mongoDeleteResult) {
      console.error("❌ MongoDB message deletion failed:", id);
    } else {
      console.log("✅ MongoDB message deleted successfully:", id);
    }

    if (!redisDeleteResult) {
      console.error("❌ Redis message deletion failed:", id);
    } else {
      console.log("✅ Redis message deleted successfully:", id);
    }

    res.status(200).json({ message: messageContent });
  } catch (error) {
    console.error("❌ Error retrieving message:", error.message);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

