const Customer = require("../models/customer");
const bcrypt = require("bcrypt");

function getAll(req, res) {
  Customer.paginate({}, { page: req.query.page, limit: 12 })
    .then(results => {
      const customers = results.docs.map(customer => {
        const cleanCustomer = { ...customer._doc };
        delete cleanCustomer.password;
        delete cleanCustomer.token;
        return cleanCustomer;
      });
      res.json({ items: customers, pages: results.pages });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to retrieve customers");
    });
}

function getOne(req, res) {
  const customerID = req.params.id;

  Customer.findById(customerID)
    .then(customer => {
      const cleanCustomer = { ...customer._doc };
      delete cleanCustomer.password;
      delete cleanCustomer.token;

      res.json(customer);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to retrieve customer.");
    });
}

function remove(req, res) {
  const customerIDs = req.body;

  Customer.deleteMany({ _id: { $in: customerIDs } })
    .then(() => Customer.find({}))
    .then(customers => res.json(customers))
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to delete customer.");
    });
}

function update(req, res) {
  const customer = req.body.customer;
  const customerID = customer._id;
  delete customer._id;

  let errorMessage = "Error saving customer.";

  Customer.findOne({ email: customer.email, _id: { $ne: customerID } })
    .then(found => {
      if (found) {
        errorMessage = "Email already in use.";
        throw new Error("");
      }
    })
    .then(() => Customer.findByIdAndUpdate(req.params.id, customer))
    .then(() => res.json(true))
    .catch(err => {
      console.log(err);
      res.status(400).send(errorMessage);
    });
}

function updateName(req, res) {
  const { firstName, lastName, customerID } = req.body;

  let errorMessage = "An error occurred. Please try again later.";

  Promise.resolve()
    .then(() => {
      if (customerID !== req.user.id) {
        throw new Error("Requesting customer doesn't match auth.");
      }
    })
    .then(() =>
      Customer.findByIdAndUpdate(
        customerID,
        { firstName, lastName },
        { new: true }
      )
    )
    .then(savedCustomer => {
      res.json({
        id: savedCustomer._id,
        firstName: savedCustomer.firstName,
        lastName: savedCustomer.lastName,
        email: savedCustomer.email
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(errorMessage);
    });
}

function updateEmail(req, res) {
  const { email, customerID } = req.body;

  let errorMessage = "An error occurred. Please try again later.";

  Promise.resolve()
    .then(() => {
      if (customerID !== req.user.id) {
        throw new Error("Requesting customer doesn't match auth.");
      }
    })
    .then(() => Customer.findOne({ email, _id: { $ne: customerID } }))
    .then(found => {
      if (found) {
        errorMessage = "Email already in use.";
        throw new Error("");
      }
    })
    .then(() => Customer.findByIdAndUpdate(customerID, email))
    .then(savedCustomer => {
      res.json({
        id: savedCustomer._id,
        firstName: savedCustomer.firstName,
        lastName: savedCustomer.lastName,
        email: savedCustomer.email
      });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(errorMessage);
    });
}

function updatePassword(req, res) {
  const { oldPassword, newPassword, customerID } = req.body;

  let errorMessage = "Error saving name.";

  bcrypt
    .compare(oldPassword, req.user.password)
    .then(match => {
      if (customerID !== req.user.id) {
        throw new Error("Requesting customer doesn't match auth.");
      }
      if (!match) {
        errorMessage = "Current password is incorrect.";
        throw new Error(errorMessage);
      }
    })
    .then(() => bcrypt.hash(newPassword, 10))
    .then(pass => Customer.findByIdAndUpdate(customerID, { password: pass }))
    .then(() => res.json(true))
    .catch(err => {
      console.log(err);
      res.status(400).send(errorMessage);
    });
}

module.exports = {
  getAll,
  getOne,
  remove,
  update,
  updateName,
  updatePassword,
  updateEmail
};
