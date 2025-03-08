import mongoose from "mongoose";
import { Confession } from "../models/Confession.js"; 

// ✅ Create a Confession
export const postConfession = async (req, res) => {
  try {
    console.log("📩 Incoming request:", req.body); // Debugging

    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const newConfession = new Confession({ message });
    await newConfession.save();

    res.status(201).json({ message: "Confession posted successfully", confession: newConfession });
  } catch (error) {
    console.error("❌ Error posting confession:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get All Confessions
// ✅ Get All Confessions
export const getAllConfessions = async (req, res) => {
  try {
    const confessions = await Confession.find({}, "_id message createdAt"); // Explicitly fetch _id, message, and timestamp
    console.log("📜 Confessions sent:", confessions); // Debugging
    res.status(200).json(confessions);
  } catch (error) {
    console.error("❌ Error fetching confessions:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


// ✅ Update a Confession
export const updateConfession = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.replace(/_/g, ""); // Remove underscores (if any)

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid confession ID" });
    }

    const { message } = req.body;
    if (!message) return res.status(400).json({ error: "Message is required" });

    const updatedConfession = await Confession.findByIdAndUpdate(id, { message }, { new: true });

    if (!updatedConfession) {
      return res.status(404).json({ error: "Confession not found" });
    }

    res.status(200).json({ message: "Confession updated successfully", confession: updatedConfession });
  } catch (error) {
    console.error("❌ Error updating confession:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Delete a Confession
export const deleteConfession = async (req, res) => {
  try {
    let { id } = req.params;
    id = id.replace(/_/g, "");

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid confession ID" });
    }

    const deletedConfession = await Confession.findByIdAndDelete(id);
    if (!deletedConfession) {
      return res.status(404).json({ error: "Confession not found" });
    }

    res.status(200).json({ message: "Confession deleted successfully" });
  } catch (error) {
    console.error("❌ Error deleting confession:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
