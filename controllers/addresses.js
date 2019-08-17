const Customer = require("../models/customer");

function add(req, res) {
  Customer.findById(req.body.id)
    .then(customer => {
      customer.addresses.forEach(address => {
        address.default = false;
      });
      customer.addresses.push(req.body.address);
      return customer.save();
    })
    .then(updatedCustomer => {
      return res.json({
        id: updatedCustomer._id,
        firstName: updatedCustomer.firstName,
        lastName: updatedCustomer.lastName,
        email: updatedCustomer.email,
        addresses: updatedCustomer.addresses
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send("Unable to save address");
    });
}

function update(req, res) {
  Customer.findById(req.body.id)
    .then(customer => {
      let foundIdx;

      customer.addresses.forEach((address, i) => {
        if (req.body.addressID === address.id) {
          foundIdx = i;
        }
        if (req.body.address.default) {
          address.default = false;
        }
      });

      if (foundIdx === undefined) {
        throw new Error("Unable to find address");
      }

      customer.addresses[foundIdx] = Object.assign(
        customer.addresses[foundIdx],
        req.body.address
      );
      return customer.save();
    })
    .then(updatedCustomer => {
      return res.json({
        id: updatedCustomer._id,
        firstName: updatedCustomer.firstName,
        lastName: updatedCustomer.lastName,
        email: updatedCustomer.email,
        addresses: updatedCustomer.addresses
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send("Unable to save address");
    });
}

function remove(req, res) {
  Customer.findById(req.body.id)
    .then(customer => {
      customer.addresses = customer.addresses.filter(address => {
        return address.id !== req.body.addressID;
      });
      return customer.save();
    })
    .then(updatedCustomer => {
      return res.json({
        id: updatedCustomer._id,
        firstName: updatedCustomer.firstName,
        lastName: updatedCustomer.lastName,
        email: updatedCustomer.email,
        addresses: updatedCustomer.addresses
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(400).send("Unable to remove address");
    });
}

module.exports = {
  add,
  update,
  remove
};
