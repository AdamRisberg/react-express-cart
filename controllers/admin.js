const Admin = require("../models/admin");
const bcrypt = require("bcrypt");

function getAll(req, res) {
  Admin.paginate({}, { page: req.query.page, limit: 12 })
    .then(results => {
      const accounts = results.docs.map(account => {
        const cleanAccount = { ...account._doc };
        delete cleanAccount.password;
        delete cleanAccount.token;
        return cleanAccount;
      });
      res.json({ items: accounts, pages: results.pages });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not retrieve admin accounts");
    });
}

function getOne(req, res) {
  const adminID = req.params.id;

  Admin.findById(adminID)
    .then(admin => {
      const cleanAdmin = { ...admin._doc };

      if (cleanAdmin.password) {
        cleanAdmin.hasPassword = true;
      }
      delete cleanAdmin.password;
      delete cleanAdmin.token;

      res.json(cleanAdmin);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to retrieve admin account");
    });
}

function remove(req, res) {
  const adminIDs = req.body;

  Admin.deleteMany({ _id: { $in: adminIDs } })
    .then(() => Admin.find({}))
    .then(accounts => res.json(accounts))
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to delet admin");
    });
}

function update(req, res) {
  const admin = req.body;
  const id = admin._id;
  delete admin._id;

  if (admin.password) {
    admin.password = bcrypt.hashSync(admin.password, 10);
  } else {
    delete admin.password;
  }

  let errorMessage;

  Admin.findOne({ email: admin.email, _id: { $ne: id } })
    .then(found => {
      if (found) {
        errorMessage = "Email already in use.";
        throw new Error("Duplicate email");
      }
    })
    .then(() => Admin.findByIdAndUpdate(id, admin, { new: true }))
    .then(_ => res.json(true))
    .catch(err => {
      console.log(err);
      res.status(400).send(errorMessage || "Could not save changes.");
    });
}

function add(req, res) {
  const admin = new Admin({
    ...req.body,
    password: bcrypt.hashSync(req.body.password, 10)
  });
  let errorMessage;

  Admin.findOne({ email: admin.email })
    .then(found => {
      if (found) {
        errorMessage = "Email already in use.";
        throw new Error("Duplicate email");
      }
    })
    .then(() => admin.save())
    .then(savedAdmin => res.json(savedAdmin._id))
    .catch(err => {
      console.log(err);
      res.status(400).send(errorMessage || "Could not create new admin.");
    });
}

module.exports = {
  getOne,
  getAll,
  remove,
  update,
  add
};
