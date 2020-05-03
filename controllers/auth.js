const { promisify } = require("util");
const Customer = require("../models/customer");
const Admin = require("../models/admin");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const jwtSign = promisify(jwt.sign);
const jwtVerify = promisify(jwt.verify);

function register(req, res) {
  const { firstName, lastName, email, password } = req.body;
  const hash = bcrypt.hashSync(password, 10);
  const customer = new Customer({
    firstName,
    lastName,
    email,
    password: hash,
  });
  let errorMessage;

  Customer.findOne({ email })
    .then((foundCustomer) => {
      if (foundCustomer) {
        errorMessage = "Email already in use.";
        throw new Error(errorMessage);
      }

      return jwtSign({ id: customer._id }, process.env.JWT_SECRET);
    })
    .then((token) => {
      customer.token = token;
      return customer.save();
    })
    .then((savedCustomer) => {
      res.json({
        success: true,
        user: {
          id: savedCustomer._id,
          firstName: savedCustomer.firstName,
          lastName: savedCustomer.lastName,
          email: savedCustomer.email,
          addresses: [],
        },
        token: savedCustomer.token,
      });
    })
    .catch((err) => {
      console.log(err.message);
      res
        .status(400)
        .send(errorMessage || "Something went wrong. Please try again later.");
    });
}

function login(req, res) {
  const { email, password } = req.body;
  const { authorization } = req.headers;

  if (authorization) {
    handleLoginWithToken(authorization.split(" ")[1], res);
  } else if (email && password) {
    handleLoginWithPassword(email, password, res);
  } else {
    res.send(400).send("No login info provided");
  }
}

function handleLoginWithToken(token, res) {
  jwtVerify(token, process.env.JWT_SECRET)
    .then((_) => Customer.findOne({ token }))
    .then((customer) => {
      res.json({
        success: true,
        user: {
          id: customer._id,
          firstName: customer.firstName,
          lastName: customer.lastName,
          email: customer.email,
          addresses: customer.addresses,
        },
        token: customer.token,
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(400).send("Invalid session");
    });
}

function handleLoginWithPassword(email, password, res) {
  let errorMessage;
  let customer;

  Customer.findOne({ email })
    .then((foundCustomer) => {
      if (!foundCustomer) {
        errorMessage = "Could not find customer";
        throw new Error(errorMessage);
      }
      if (!bcrypt.compareSync(password, foundCustomer.password)) {
        errorMessage = "Incorrect password";
        throw new Error(errorMessage);
      }
      customer = foundCustomer;
      return jwtSign({ id: customer._id }, process.env.JWT_SECRET);
    })
    .then((token) => {
      customer.token = token;
      return customer.save();
    })
    .then((updatedCustomer) => {
      res.json({
        success: true,
        user: {
          id: updatedCustomer._id,
          firstName: updatedCustomer.firstName,
          lastName: updatedCustomer.lastName,
          email: updatedCustomer.email,
          addresses: updatedCustomer.addresses,
        },
        token: updatedCustomer.token,
      });
    })
    .catch((err) => {
      console.log(err.message);
      return res
        .status(400)
        .send(errorMessage || "Unable to login. Please try again later.");
    });
}

function adminLogin(req, res) {
  const { email, password } = req.body;
  const { authorization } = req.headers;

  if (authorization) {
    handleAdminLoginWithToken(authorization.split(" ")[1], res);
  } else if (email && password) {
    handleAdminLoginWithPassword(email, password, res);
  } else {
    res.send(400).send("No login info provided");
  }
}

function handleAdminLoginWithToken(token, res) {
  jwtVerify(token, process.env.JWT_SECRET)
    .then((_) => Admin.findOne({ token, active: true }))
    .then((admin) => {
      res.json({
        success: true,
        user: {
          id: admin._id,
          firstName: admin.firstName,
          lastName: admin.lastName,
          email: admin.email,
          allowEdit: admin.allowEdit,
        },
        token: admin.token,
      });
    })
    .catch((err) => {
      console.log(err.message);
      res.status(400).send("Invalid session");
    });
}

function handleAdminLoginWithPassword(email, password, res) {
  let errorMessage;
  let admin;

  Admin.findOne({ email, active: true })
    .then((foundAdmin) => {
      if (!foundAdmin) {
        errorMessage = "Could not find account";
        throw new Error(errorMessage);
      }
      if (!bcrypt.compareSync(password, foundAdmin.password)) {
        errorMessage = "Incorrect password";
        throw new Error(errorMessage);
      }
      admin = foundAdmin;

      return jwtSign({ id: admin._id }, process.env.JWT_SECRET, {
        expiresIn: "12h",
      });
    })
    .then((token) => {
      admin.token = token;
      return admin.save();
    })
    .then((updatedAdmin) => {
      res.json({
        success: true,
        user: {
          id: updatedAdmin._id,
          firstName: updatedAdmin.firstName,
          lastName: updatedAdmin.lastName,
          email: updatedAdmin.email,
          allowEdit: admin.allowEdit,
        },
        token: updatedAdmin.token,
      });
    })
    .catch((err) => {
      console.log(err.message);
      return res
        .status(400)
        .send(errorMessage || "Unable to login. Please try again later.");
    });
}

function logout(req, res) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.json(true);
  }
  const token = authorization.split(" ")[1];

  Customer.findOneAndUpdate({ token: token }, { token: "" })
    .then(() => res.json(true))
    .catch(console.log);
}

function adminLogout(req, res) {
  const { authorization } = req.headers;

  if (!authorization) {
    return res.json(true);
  }
  const token = authorization.split(" ")[1];

  Admin.findOneAndUpdate({ token: token }, { token: "" })
    .then(() => res.json(true))
    .catch(console.log);
}

module.exports = {
  login,
  register,
  adminLogin,
  logout,
  adminLogout,
};
