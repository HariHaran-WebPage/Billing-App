const express = require("express");
const router = express.Router();
const User = require("../Model/StaffModel");

// Create a new user with default role as "staff"
router.post("/Staff", async (req, res) => {
  try {
    const { name, mobile, password } = req.body;
    const Staff = new User({ name, mobile, password, role: "staff" }); // Set role to "staff"
    await Staff.save();
    res.status(201).send(Staff);
  } catch (err) {
    res.status(400).send(err);
  }
});

// Get all staff members
router.get("/Staff", async (req, res) => {
  try {
    const staff = await User.find({ role: "staff" }); // Fetch all staff members
    res.status(200).json(staff);
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete a staff member by ID
router.delete("/Staff/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedStaff = await User.findByIdAndDelete(id);
    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res
      .status(200)
      .json({ message: "Staff member deleted successfully", deletedStaff });
  } catch (err) {
    console.error("Error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
