const mongoose = require("mongoose");
const Admin = require("./models/admin");
const bcrypt = require("bcrypt");

mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true })
  .then(() => mongoose.connection.db.listCollections().toArray())
  .then(collections => collections.map(col => col.name).length)
  .then(numOfCollections => !numOfCollections && createDefaultUser())
  .catch(console.log);

mongoose.set("useFindAndModify", false);
mongoose.set("useCreateIndex", true);

process.on("SIGINT", () => {
  mongoose.connection.close().then(() => process.exit(0));
});

function createDefaultUser() {
  const defaultAdmin = new Admin({
    firstName: "Default",
    lastName: "Admin",
    email: "admin@example.com",
    password: bcrypt.hashSync("password", 10),
    active: true,
    allowEdit: true
  });
  return defaultAdmin.save();
}
