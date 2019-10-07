const Cart = require("../models/cart");
const Order = require("../models/order");
const ShippingMethod = require("../models/shipping");
const fs = require("fs");
const { promisify } = require("util");
const stripe = require("stripe")("sk_test_bVsmWqjL4C09q3NnBz4sok9S");
const nodemailer = require("nodemailer");
const {
  createConfirmationEmailHTML,
  createConfirmationEmailText
} = require("../utils/utils");
const readFile = promisify(fs.readFile);

function createOrder(req, res) {
  const {
    email,
    billingAddress,
    shippingAddress,
    cartID,
    userID,
    paymentMethod,
    shippingMethod,
    ipAddress,
    tokenID,
    shippingID
  } = req.body;

  let order = new Order({
    email,
    billingAddress,
    shippingAddress,
    paymentMethod,
    shippingMethod,
    ipAddress,
    status: "Processing",
    date: new Date(),
    shipping: 0,
    history: [
      {
        date: new Date(),
        status: "Processing",
        notified: "Yes",
        comment: "",
        tracking: []
      }
    ]
  });

  if (userID) {
    order.customer = userID;
  }

  ShippingMethod.findById(shippingID)
    .then(method => {
      if (!method) {
        throw new Error("Could not find shipping method.");
      }
      order.shipping = method.price;
    })
    .then(() => Cart.findById(cartID))
    .then(cart => {
      order.items = cart.items;

      order.subtotal = order.items.reduce((acc, item) => {
        const price = acc + item.price * item.quantity;
        return parseFloat(price.toFixed(2), 10);
      }, 0);

      const total = order.subtotal + order.shipping;
      order.total = parseFloat(total.toFixed(2), 10);

      const stripeTotal = parseFloat((order.total * 100).toFixed(2), 10);

      return stripe.charges.create({
        amount: stripeTotal,
        currency: "usd",
        source: tokenID
      });
    })
    .then(_ => order.save())
    .then(savedOrder => {
      sendConfirmationEmail(savedOrder);
      res.json({ success: true, orderID: order.id, order: savedOrder });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to place order.");
    });
}

function getShippingMethods(req, res) {
  ShippingMethod.find({})
    .then(methods => res.json(methods))
    .catch(console.log);
}

function sendConfirmationEmail(order) {
  readFile("./settings/settings.json", "utf8")
    .then(file => JSON.parse(file))
    .then(settings => {
      const emailSettings = settings.email;
      const companyName = settings.general.store_name;

      const transporter = nodemailer.createTransport({
        host: emailSettings.smtp_host,
        port: emailSettings.smtp_port,
        secure: emailSettings.use_ssl,
        auth: {
          user: emailSettings.username,
          pass: process.env.EMAIL_PASSWORD
        }
      });

      const mailOptions = {
        from: emailSettings.email_address,
        to: order.email,
        subject: companyName + " - Order Confirmation #" + order.orderNumber,
        text: createConfirmationEmailText(order, companyName),
        html: createConfirmationEmailHTML(order, companyName)
      };

      transporter.sendMail(mailOptions, error => {
        if (error) {
          console.log(error);
        }
      });
    });
}

module.exports = {
  createOrder,
  getShippingMethods
};
