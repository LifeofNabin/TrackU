import express from "express";
import { handleFaceRecognition } from "../controllers/faceController.js";

const router = express.Router();

// POST /api/face/recognize
router.post("/recognize", handleFaceRecognition);

export default router;
