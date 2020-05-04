const mongoose = require("mongoose");
const Order = require("../models/order");
const addDays = require("date-fns/addDays");
const addMonths = require("date-fns/addMonths");
const startOfWeek = require("date-fns/startOfWeek");
const startOfMonth = require("date-fns/startOfMonth");
const startOfYear = require("date-fns/startOfYear");
const endOfToday = require("date-fns/endOfToday");
const endOfDay = require("date-fns/endOfDay");
const {
  createStatusEmailHTML,
  createStatusEmailText
} = require("../utils/utils");
const fs = require("fs");
const nodemailer = require("nodemailer");
const { promisify } = require("util");
const readFile = promisify(fs.readFile);

function getOrdersYears(req, res) {
  const userID = req.params.userID;

  Order.aggregate([
    {
      $match: {
        customer: mongoose.Types.ObjectId(userID)
      }
    },
    {
      $project: {
        year: { $year: "$date" }
      }
    },
    {
      $group: {
        _id: null,
        years: { $addToSet: { year: "$year" } }
      }
    }
  ])
    .then(result => {
      if (!result.length) {
        return res.json([]);
      }
      res.json(result[0].years.map(year => year.year));
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to retrieve order years.");
    });
}

function getCustomerOrders(req, res) {
  const userID = req.params.userID;

  if (userID !== req.user.id) {
    return res.status(401).send("Unauthorized");
  }

  const filter = req.query.filter;
  const page = req.query.page;
  const limit = parseInt(req.query.limit) || 4;

  const query = { customer: userID };

  if (filter) {
    const dates = convertToStartDate(filter);
    query.date = {
      $gte: dates.start,
      $lte: dates.end
    };
  }

  Order.paginate(query, { page: page, limit: limit })
    .then(results => {
      res.json({ items: results.docs, pages: results.pages });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not retrieve orders");
    });
}

function getAllOrders(req, res) {
  const limit = parseInt(req.query.limit) || 12;

  Order.paginate({}, { page: req.query.page, limit: limit })
    .then(results => {
      res.json({ items: results.docs, pages: results.pages });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Could not retrieve orders");
    });
}

function getOneOrder(req, res) {
  Order.findById(req.params.orderID)
    .then(order => {
      if (!req.user.active && order.customer.toString() !== req.user.id) {
        return res.status(401).send("Unauthorized");
      }
      res.json(order);
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to retrieve order");
    });
}

function convertToStartDate(filter) {
  let dates = {};

  if (filter === "last30") {
    dates.start = addDays(new Date(), -30);
    dates.end = endOfToday();
  } else if (filter === "last6") {
    dates.start = addMonths(new Date(), -6);
    dates.end = endOfToday();
  } else {
    dates.start = new Date(parseInt(filter), 0, 1);
    dates.end = endOfDay(new Date(parseInt(filter), 11, 31));
  }

  return dates;
}

function add(req, res) {
  const order = new Order({ ...req.body.order });

  order
    .save()
    .then(savedOrder => res.json(savedOrder._id))
    .catch(console.log);
}

function update(req, res) {
  const order = req.body.order;
  delete order._id;

  Order.findByIdAndUpdate(req.params.id, order)
    .then(() => res.json(true))
    .catch(console.log);
}

function remove(req, res) {
  const orderIDs = req.body;

  Order.deleteMany({ _id: { $in: orderIDs } })
    .then(() => Order.find({}))
    .then(orders => res.json(orders))
    .catch(err => {
      console.log(err);
      res.status(400).send("Unable to delete order(s)");
    });
}

function getOrderAnalytics(req, res) {
  const by = req.query.by;
  const dates = {};
  const groupID = {
    year: {
      $year: "$date"
    },
    month: {
      $month: "$date"
    },
    dayOfMonth: {
      $dayOfMonth: "$date"
    },
    dayOfWeek: {
      $dayOfWeek: "$date"
    }
  };

  dates.end = endOfToday(new Date());

  if (by === "year") {
    delete groupID.dayOfMonth;
    delete groupID.dayOfWeek;
    dates.start = startOfYear(new Date());
  } else if (by === "month") {
    delete groupID.dayOfWeek;
    dates.start = startOfMonth(new Date());
  } else {
    dates.start = startOfWeek(new Date());
  }

  Order.aggregate([
    {
      $match: {
        date: {
          $gte: dates.start,
          $lte: dates.end
        }
      }
    },
    {
      $group: {
        _id: groupID,
        totalPrice: { $sum: "$total" },
        count: { $sum: 1 }
      }
    }
  ])
    .then(results => {
      res.json(results);
    })
    .catch(err => {
      res.status(500).send(err);
    });
}

function addHistory(req, res) {
  const orderID = req.params.orderID;
  const historyItem = req.body;
  historyItem.date = new Date();

  let customerName;
  let customerEmail;
  let orderNumber;

  Order.findByIdAndUpdate(
    orderID,
    { $push: { history: historyItem }, status: historyItem.status },
    { new: true }
  )
    .then(updatedOrder => {
      const { firstName } = updatedOrder.billingAddress;
      customerName = firstName;
      customerEmail = updatedOrder.email;
      orderNumber = updatedOrder.orderNumber;
      res.json(updatedOrder);
    })
    .then(() => {
      if (historyItem.notified) {
        sendStatusEmail(historyItem, customerName, customerEmail, orderNumber);
      }
    })
    .catch(console.log);
}

function sendStatusEmail(status, customerName, customerEmail, orderNumber) {
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
        to: customerEmail,
        subject: companyName + " - Order #" + orderNumber + " Status Update",
        text: createStatusEmailText(
          status,
          companyName,
          customerName,
          orderNumber
        ),
        html: createStatusEmailHTML(
          status,
          companyName,
          customerName,
          orderNumber
        )
      };

      transporter.sendMail(mailOptions, error => {
        if (error) {
          console.log(error);
        }
      });
    });
}

module.exports = {
  getAllOrders,
  getCustomerOrders,
  getOneOrder,
  getOrdersYears,
  add,
  update,
  remove,
  getOrderAnalytics,
  addHistory
};
