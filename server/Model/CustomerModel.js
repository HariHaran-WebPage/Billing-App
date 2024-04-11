const mongoose = require("mongoose");

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  shopName: {
    type: String,
    required: true,
  },
  // other customer properties if needed
});

module.exports = mongoose.model("Customer", customerSchema);
