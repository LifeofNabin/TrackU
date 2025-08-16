import { analyzeActivity } from "../services/activityAnalysisService.js";
import ActivityLog from "../models/ActivityLog.js";

export const logActivity = async (req, res) => {
  const { userId, activityData } = req.body;
  try {
    // Call AI model to analyze activity
    const result = await analyzeActivity(activityData);

    // Save activity to database
    const log = await ActivityLog.create({
      user: userId,
      activity: result.activity
    });

    res.json({ success: true, result, log });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
