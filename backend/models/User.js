import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  otp: { type: String, default: null },
  otpExpires: { type: Date, default: null },
  isVerified: { type: Boolean, default: false },
});

export const User = mongoose.model("User", UserSchema);
