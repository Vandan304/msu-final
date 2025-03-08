import express from "express";
import {
  postConfession,
  getAllConfessions,
  updateConfession,
  deleteConfession,
} from "../controllers/confessionController.js";

const router = express.Router();

router.post("/", postConfession);
router.get("/", getAllConfessions);
router.put("/:id", updateConfession);
router.delete("/:id", deleteConfession);

export default router;
