import mongoose from "mongoose";

const SecretMessageSchema = new mongoose.Schema({
  message: { type: String, required: true },
  password: { type: String, required: false }, // Optional password protection
  key: { type: String, required: true, unique: true }, // Unique key for retrieval
  createdAt: { type: Date, default: Date.now },
  expiresAt: { type: Date, default: () => new Date(Date.now() + 24 * 60 * 60 * 1000) }, // Auto-delete after 24 hours
});

export const SecretMessage = mongoose.model("SecretMessage", SecretMessageSchema);
