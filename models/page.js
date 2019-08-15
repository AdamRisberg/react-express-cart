const mongoose = require("mongoose");

const pageSchema = new mongoose.Schema({
  title: {
    type: String,
    default: ""
  },
  content: {
    type: String,
    default: ""
  },
  path: {
    type: String,
    default: ""
  },
  metaDescription: {
    type: String,
    default: ""
  }
});

module.exports = mongoose.model("page", pageSchema);
