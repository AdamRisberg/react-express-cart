const Cart = require("../models/cart");
const Product = require("../models/product");

function add(req, res) {
  const { cartItem, cartID } = req.body;
  let errorMessage;

  Product.findById(cartItem.productID)
    .then(product => {
      if (!verifyPrice(cartItem, product)) {
        errorMessage = "Unable to verify price";
        throw new Error(errorMessage);
      }

      return cartID ? Cart.findById(cartID) : new Cart({ items: [] });
    })
    .then(cart => {
      let found = false;

      for (let i = 0; i < cart.items.length; i++) {
        if (
          cartItem.productID === cart.items[i].productID &&
          cartItem.optionsKey === cart.items[i].optionsKey
        ) {
          cart.items[i].quantity += cartItem.quantity;
          found = true;
          break;
        }
      }

      if (!found) {
        cart.items.push(cartItem);
      }
      cart.lastUpdated = new Date();
      return cart.save();
    })
    .then(updatedCart => {
      res.json({
        cart: updatedCart.items,
        cartID: updatedCart._id
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(400).send("Error saving cart.");
    });
}

function get(req, res) {
  const cartID = req.params.id;
  let cart;

  Cart.findById(cartID)
    .then(foundCart => {
      if (!foundCart) throw new Error("Could not find cart");

      const IDs = foundCart.items.map(item => item.productID);
      cart = foundCart;
      return Product.find({ _id: { $in: IDs } });
    })
    .then(products => {
      verifyAllPrices(cart, products);
      return cart.save();
    })
    .then(savedCart => {
      res.json({
        cart: savedCart.items,
        cartID: savedCart._id
      });
    })
    .catch(err => {
      console.log(err.message);
      res.status(400).send("Unable to retrieve cart");
    });
}

function remove(req, res) {
  const { cartID, id, optionsKey } = req.body;

  Cart.findById(cartID)
    .then(cart => {
      cart.items = cart.items.filter(item => {
        return item.id !== id || item.optionsKey !== optionsKey;
      });
      return cart.save();
    })
    .then(updatedCart => {
      res.json(updatedCart.items);
    })
    .catch(err => {
      console.log(err.message);
      res.status(400).send("Unable to remove cart item");
    });
}

function clear(req, res) {
  const { cartID } = req.body;

  Cart.findByIdAndUpdate(cartID, { $set: { items: [] } })
    .then(_ => res.json([]))
    .catch(err => {
      console.log(err.message);
      return res.status(400).send("Error clearing cart");
    });
}

function verifyAllPrices(cart, products) {
  cart.items.forEach(item => {
    let found;

    for (let i = 0; i < products.length; i++) {
      if (item.productID === products[i].id) {
        found = products[i];
      }
    }

    if (!verifyPrice(item, found)) {
      item.remove();
    }
  });
}

function verifyPrice(cartItem, product) {
  if (!product) return false;

  cartItem.price = product.price;

  for (let j = 0; j < cartItem.options.length; j++) {
    const itemOption = cartItem.options[j];
    const productOptions = findOption(product.options, itemOption.optionID);

    if (!productOptions) return false;

    for (let i = 0; i < productOptions.length; i++) {
      if (productOptions[i].label === itemOption.value) {
        itemOption.price = productOptions[i].price;
        cartItem.price += itemOption.price;
      }
    }
  }
  return true;
}

function findOption(options, findId) {
  for (let i = 0; i < options.length; i++) {
    if (options[i].id === findId) {
      return options[i].options;
    }
  }
}

module.exports = {
  add,
  get,
  remove,
  clear
};
