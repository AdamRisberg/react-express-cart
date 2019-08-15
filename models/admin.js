const mongoose = require("mongoose");
const mongoosePaginate = require("mongoose-paginate");

const adminSchema = new mongoose.Schema({
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, default: "" },
  password: { type: String, default: "" },
  token: { type: String, default: "" },
  dateAdded: { type: Date, default: new Date() },
  active: { type: Boolean, default: false },
  allowEdit: { type: Boolean, default: false }
});

adminSchema.plugin(mongoosePaginate);

module.exports = mongoose.model("admin", adminSchema);
