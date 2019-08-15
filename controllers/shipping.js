const ShippingMethod = require("../models/shipping");

function getAll(req, res) {
  ShippingMethod.paginate({}, { page: req.query.page, limit: 12 })
    .then(results => {
      res.json({ items: results.docs, pages: results.pages });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not retrieve shipping");
    });
}

function getActive(req, res) {
  ShippingMethod.find({ active: true })
    .then(methods => res.json(methods))
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not retrieve shipping");
    });
}

function getOne(req, res) {
  ShippingMethod.findById(req.params.id)
    .then(shipping => res.json({ shipping }))
    .catch(console.log);
}

function add(req, res) {
  const shipping = new ShippingMethod(req.body);

  shipping
    .save()
    .then(savedShipping => res.json(savedShipping._id))
    .catch(console.log);
}

function update(req, res) {
  const shippingID = req.body._id;
  delete req.body._id;

  ShippingMethod.findByIdAndUpdate(shippingID, req.body, { new: true })
    .then(updatedShipping => res.json(updatedShipping))
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not save changes");
    });
}

function remove(req, res) {
  const shippingIDs = req.body;

  ShippingMethod.deleteMany({ _id: { $in: shippingIDs } })
    .then(() => ShippingMethod.find({}))
    .then(shipping => res.json(shipping))
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to delete shipping");
    });
}

module.exports = {
  getAll,
  getActive,
  add,
  getOne,
  update,
  remove
};
