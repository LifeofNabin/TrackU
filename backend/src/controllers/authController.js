// backend/src/controllers/authController.js
import User from "../models/user.js";
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "Email already registered" });
    }

    // Create new user
    const user = new User({ name, email, password });
    await user.save();

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      user: { id: user._id, name: user.name, email: user.email },
      token
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
