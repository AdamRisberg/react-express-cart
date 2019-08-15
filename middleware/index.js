const Customer = require("../models/customer");
const Admin = require("../models/admin");
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const jwtVerify = promisify(jwt.verify);

function authorizeCustomer(req, res, next) {
  if (req.user) return next();

  checkAuthorization(Customer, req.headers)
    .then(user => {
      req.user = user;
      return next();
    })
    .catch(_ => {
      return next();
    });
}

function authorizeAdmin(req, res, next) {
  if (req.user) return next();

  checkAuthorization(Admin, req.headers)
    .then(user => {
      if (user.active) {
        req.user = user;
      }

      return next();
    })
    .catch(err => {
      req.failedAdmin = true;
      return next();
    });
}

function checkAuthorization(model, headers) {
  const { authorization } = headers;

  if (!authorization) {
    return Promise.reject();
  }

  const token = authorization.split(" ")[1];

  return jwtVerify(token, process.env.JWT_SECRET)
    .then(() => model.findOne({ token }))
    .then(doc => {
      if (doc) return Promise.resolve(doc);
      else return Promise.reject();
    });
}

function userExists(req, res, next) {
  if (req.user) {
    return next();
  }
  if (req.failedAdmin) {
    return res.status(401).send({ logout: true });
  }
  return res.status(401).send("Unauthorized");
}

function userIsAdmin(req, res, next) {
  if (req.user && req.user.active) {
    return next();
  }
  return res.status(401).send({ logout: true });
}

function userHasEditPermission(req, res, next) {
  if (req.user.allowEdit) {
    return next();
  }
  return res.status(401).send("Unauthorized");
}

module.exports = {
  authorizeCustomer,
  authorizeAdmin,
  userExists,
  userIsAdmin,
  userHasEditPermission
};
