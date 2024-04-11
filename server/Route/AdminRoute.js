const express = require("express");
const router = express.Router();
const User = require("../Model/AdminModel");
require("dotenv").config(); // Load environment variables from .env file

// Route to create a new user with default role as "admin"
router.post("/admin", async (req, res) => {
  try {
    const name = process.env.NAME;
    const phone = process.env.PHONE;
    const password = process.env.PASSWORD;
    const defaultRole = "admin"; // Default role is "admin"

    if (!name || !phone || !password) {
      return res.status(400).json({ message: "Environment variables missing" });
    }

    const newUser = new User({ name, phone, password, role: defaultRole });
    await newUser.save();
    res.status(201).json({ message: "Admin added successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Export the router to use in the main app
module.exports = router;
