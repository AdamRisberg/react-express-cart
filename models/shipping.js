const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const shippingMethodSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  label: {
    type: String,
    default: ""
  },
  price: {
    type: Number,
    default: 0
  },
  active: {
    type: Boolean,
    default: true
  }
});

shippingMethodSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("shipping_method", shippingMethodSchema);
