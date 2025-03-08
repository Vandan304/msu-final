import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

export const connectDB = async () => {
  try {
    const mongoURI = process.env.DATABASE_URL;
    if (!mongoURI) {
      throw new Error("❌ DATABASE_URL is missing in .env file");
    }

    const conn = await mongoose.connect(mongoURI, {
      dbName: "secretConfessionsDB", // ✅ Use a specific database
      tlsAllowInvalidCertificates: true, // ✅ Ignore self-signed certificate issue
    });

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};
