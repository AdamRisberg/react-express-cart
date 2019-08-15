const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    default: ""
  },
  model: {
    type: String,
    default: ""
  },
  featured: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    default: ""
  },
  path: {
    type: String,
    default: ""
  },
  info: [
    {
      title: String,
      body: String
    }
  ],
  price: {
    type: Number,
    default: 0
  },
  images: [
    {
      src: String,
      alt: String
    }
  ],
  options: [
    {
      optionType: String,
      label: String,
      options: [
        {
          label: String,
          price: Number,
          color: String,
          default: Boolean
        }
      ]
    }
  ],
  metaDescription: {
    type: String,
    default: ""
  }
});

productSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("product", productSchema);
