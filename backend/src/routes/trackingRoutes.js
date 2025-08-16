import express from "express";
import { logActivity } from "../controllers/trackingController.js";

const router = express.Router();

// POST /api/tracking/log
router.post("/log", logActivity);

export default router;
