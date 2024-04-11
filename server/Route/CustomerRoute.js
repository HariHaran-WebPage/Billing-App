const express = require("express");
const router = express.Router();
const Customer = require("../Model/CustomerModel"); // Import Customer model

// Create a new customer
router.post("/store", async (req, res) => {
  try {
    const { name, shopName } = req.body;
    const customer = new Customer({ name, shopName });
    await customer.save();
    res.status(201).json(customer);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Get all customers
router.get("/Storeall", async (req, res) => {
  try {
    const customers = await Customer.find();
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific customer by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findById(id);
    if (!customer) {
      return res.status(404).json({ message: "Customer not found" });
    }
    res.json(customer);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete a specific customer by ID
router.delete("/store/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const customer = await Customer.findByIdAndDelete(id);
    if (!customer) {
      return res
        .status(404)
        .json({ message: "Customer not found or already deleted" });
    }
    res.json({ message: "Customer deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete customer" });
  }
});

module.exports = router;
