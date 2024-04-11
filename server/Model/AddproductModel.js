const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  priceForPC: {
    type: Number,
    required: true,
  },
  priceForBox: {
    type: Number,
    required: true,
  },
  // other product properties if needed
});

module.exports = mongoose.model("Product", productSchema);
