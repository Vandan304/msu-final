import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

// Create Transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER, // Your email from .env
    pass: process.env.EMAIL_PASS, // App Password from Gmail settings
  },
  tls: {
    rejectUnauthorized: false, // ✅ Fix self-signed certificate issue
  },
});

// Function to Generate a 4-Digit OTP (Only Numbers)
export const generateOtp = () => {
  return Math.floor(1000 + Math.random() * 9000).toString(); // Generates a 4-digit OTP (1000-9999)
};

// Function to Set OTP Expiration Time (1 Minute)
export const getOtpExpirationTime = () => {
  return new Date(Date.now() + 60 * 1000); // Current time + 1 minute
};

// Send OTP Email Function
export const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify Your Email - OTP",
    html: `
      <div style="font-family: Arial, sans-serif; text-align: center;">
        <h2>Verify Your Email</h2>
        <p>Your OTP for email verification is:</p>
        <h1 style="color: #ff6600; font-size: 30px;">${otp}</h1>
        <p>This OTP expires in <strong>1 minute</strong>. Do not share it with anyone.</p>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("✅ OTP Email Sent Successfully");
  } catch (error) {
    console.error("❌ Email Send Error:", error);
    throw new Error("Failed to send OTP email");
  }
};
