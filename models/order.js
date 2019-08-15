const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const counterSchema = new mongoose.Schema({
  counter: {
    type: Number,
    default: 2
  }
});

const Counter = mongoose.model("Counter", counterSchema);

const orderSchema = new mongoose.Schema({
  orderNumber: Number,
  customer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "customer"
  },
  billingAddress: {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    address1: { type: String, default: "" },
    address2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    phone: { type: String, default: "" }
  },
  shippingAddress: {
    firstName: { type: String, default: "" },
    lastName: { type: String, default: "" },
    address1: { type: String, default: "" },
    address2: { type: String, default: "" },
    city: { type: String, default: "" },
    state: { type: String, default: "" },
    zip: { type: String, default: "" },
    phone: { type: String, default: "" }
  },
  paymentMethod: { type: String, default: "" },
  shippingMethod: { type: String, default: "" },
  ipAddress: { type: String, default: "" },
  history: [],
  status: { type: String, default: "" },
  email: { type: String, default: "" },
  date: { type: Date, default: new Date() },
  items: [],
  subtotal: { type: Number, default: 0 },
  shipping: { type: Number, default: 0 },
  total: { type: Number, default: 0 }
});

orderSchema.pre("save", function(next) {
  Counter.findOneAndUpdate(
    {},
    { $inc: { counter: 1 } },
    { upsert: true, new: true }
  )
    .then(counter => {
      this.orderNumber = counter.counter;
      next();
    })
    .catch(err => {
      console.log(err);
    });
});

orderSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("order", orderSchema);
