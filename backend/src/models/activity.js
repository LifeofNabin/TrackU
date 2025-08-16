// src/models/Activity.js
import mongoose from "mongoose";

const activitySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  action: {
    type: String,
    required: true
  },
  details: {
    type: String,
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

const Activity = mongoose.model("Activity", activitySchema);
export default Activity;
