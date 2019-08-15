const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  path: {
    type: String,
    default: ""
  },
  pathName: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  topLevel: {
    type: Boolean,
    default: true
  },
  parent: {
    type: String,
    default: ""
  },
  subcategories: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "category"
    }
  ],
  metaDescription: {
    type: String,
    default: ""
  },
  order: {
    type: String,
    default: "a"
  }
});

categorySchema.pre("find", populateChildren).pre("findOne", populateChildren);

function populateChildren(next) {
  this.populate({
    path: "subcategories",
    options: { sort: { order: 1, _id: 1 } }
  });
  next();
}

module.exports = mongoose.model("category", categorySchema);
