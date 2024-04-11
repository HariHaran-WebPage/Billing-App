const mongoose = require("mongoose");

const staffSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "staff", // Set default role to "staff"
  },
});

const Staff = mongoose.model("Staff", staffSchema, "staff"); // Specify collection name 'staff'

module.exports = Staff;
