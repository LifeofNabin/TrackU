// routes/authRoutes.js
const express = require("express");
const fs = require("fs");
const path = require("path");
const User = require("../models/User");  // Import the User model

const router = express.Router();

let users = [];  // Temporary storage for users (can later be replaced with a database)

// Register route
router.post("/register", (req, res) => {
  const { email, password, faceData } = req.body;
  
  const user = new User(email, password, faceData);
  const imageBuffer = Buffer.from(faceData, "base64");

  // Save face image
  fs.writeFileSync(path.join(__dirname, "../faces", `${user.userId}.png`), imageBuffer);

  // Save user details
  users.push(user);

  res.json({ success: true, userId: user.userId });
});

// Login route
router.post("/login", (req, res) => {
  const { userId, password, faceData } = req.body;

  const user = users.find((user) => user.userId === userId && user.password === password);

  if (!user) {
    return res.json({ success: false, message: "Invalid credentials" });
  }

  // Face recognition logic (simplified)
  const storedFaceData = fs.readFileSync(path.join(__dirname, "../faces", `${userId}.png`));
  if (storedFaceData.toString("base64") !== faceData) {
    return res.json({ success: false, message: "Face mismatch" });
  }

  res.json({ success: true });
});

module.exports = router;
