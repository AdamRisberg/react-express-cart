const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  lastUpdated: Date,
  items: [
    {
      productID: String,
      image: {},
      name: String,
      options: [
        {
          optionID: String,
          price: Number,
          value: String,
          name: String
        }
      ],
      optionsKey: String,
      price: Number,
      quantity: Number
    }
  ]
});

module.exports = mongoose.model("cart", cartSchema);
