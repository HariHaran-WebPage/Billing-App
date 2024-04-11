const express = require("express");
const router = express.Router();
const Admin = require("../Model/AdminModel");
const Staff = require("../Model/StaffModel");
require("dotenv").config(); // Load environment variables from .env file

// Login route for both admins and staff
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    // Check if the username exists in Admin collection
    const admin = await Admin.findOne({ username });
    if (admin && password === admin.password) {
      // Login successful for admin
      return res.status(200).json({
        message: "Admin login successful",
        user: admin,
        role: "admin", // Add the role to the response for admins
      });
    }

    // Check if the username exists in Staff collection
    const staff = await Staff.findOne({ username });
    if (staff && password === staff.password) {
      // Login successful for staff
      return res.status(200).json({
        message: "Staff login successful",
        user: staff,
        role: "staff", // Add the role to the response for staff
      });
    }

    // Username or password incorrect
    res.status(401).json({ error: "Invalid username or password" });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
