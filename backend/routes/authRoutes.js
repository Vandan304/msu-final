import express from "express";
import { registerUser, verifyOtp, resendOtp, loginUser, protect } from "../controllers/authController.js";
import { body } from "express-validator";

const router = express.Router();

// ✅ Signup (Send OTP)
router.post(
  "/signup",
  [
    body("email").isEmail().withMessage("Valid email is required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters"),
  ],
  registerUser
);

// ✅ Verify OTP
router.post("/verify-otp", verifyOtp);

// ✅ Resend OTP
router.post("/resend-otp", resendOtp);

// ✅ Login
router.post("/login", loginUser);

// ✅ Protected Route Example
router.get("/profile", protect, (req, res) => {
  res.json({ message: "This is a protected route", user: req.user });
});

export default router;
