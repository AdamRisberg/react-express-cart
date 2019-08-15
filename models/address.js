const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  firstName: String,
  lastName: String,
  address1: String,
  address2: String,
  city: String,
  state: String,
  zip: String,
  phone: String,
  default: Boolean,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer"
  }
});

module.exports = mongoose.model("address", addressSchema);
