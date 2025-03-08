import mongoose from "mongoose";

const confessionSchema = new mongoose.Schema(
  {
    message: {
      type: String,
      required: [true, "Confession content is required"],
      trim: true,
    },
  },
  { timestamps: true } // Adds createdAt & updatedAt fields automatically
);

export const Confession = mongoose.model("Confession", confessionSchema);
