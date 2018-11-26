const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const winston = require("../config/winston.js");
//var csrf = require('csurf')
//var csrfProtection = csrf({ cookie: true })

const PASS_REG = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,12}$/;

exports.getSignup = (req, res, next) => {
  winston.info("GET request /user/signup");
  res.render("auth/register", { csrfToken: req.csrfToken() });
};

exports.signup = (req, res, next) => {
  winston.info("POST request /user/signup");

  var user = new UserModel();
  var u = {
    name: req.body.name,
    email: req.body.email,
    pass: req.body.password
  };

  if (!PASS_REG.test(u.pass)) {
    console.log(
      "The password must have 6-12 characters and must contain numbers and letters"
    );
    winston.error(
      `UsersController.post(/users/signup) -> failed: password lentght is not between 6-12 characters`
    );
  } else if (u.pass != req.body.repassword) {
    console.log("The password and the confirmation are different");
    winston.error(
      `UsersController.post(/users/signup) -> failed: passwords do not match`
    );
  } else {
    user
      .register(u)
      .then(result => {
        winston.info(
          `UsersController.post(/users/signup) -> succeeded: ${JSON.stringify(
            result
          )}`
        );
        res.status(201).redirect("/users/login");
      })
      .catch(err => {
        winston.error(
          `UsersController.post(/users/signup) -> failed: ${JSON.stringify(
            err
          )}`
        );
        res.status(500).json({});
      });
  }
};

exports.getLogin = (req, res, next) => {
  winston.info("GET request /user/login");
  return res.render("auth/login", { csrfToken: req.csrfToken() });
};

exports.login = (req, res, next) => {
  winston.info("POST request /user/login");
  const user = new UserModel();

  user
    .login(req.body.email, req.body.password)
    .then(result => {
      if (!result) {
        winston.error(
          `UsersController.post(/users/login) -> failed: User or password incorrect`
        );
        return res.status(401).json({ message: "User or password incorrect" });
      }
      if (!result.verified) {
        winston.error(
          `UsersController.post(/users/login) -> failed: User not verified. Check email`
        );
        return res
          .status(401)
          .json({ message: "User not verified. Check email" });
      } else {
        console.log("Login successful");
        const token = jwt.sign(
          {
            email: req.body.email,
            userId: result.ID
          },
          process.env.JWT_KEY,
          { expiresIn: "1h" }
        );

        res.cookie("Cookie", token, { maxAge: 3600000, httpOnly: true });
        winston.info(
          `UsersController.post(/users/login) -> succeeded: Login successful, cookie set, redirect to page with posts`
        );
        return res.redirect("../posts");
      }
    })
    .catch(err => {
      winston.error(
        `UsersController.post(/users/login) -> failed: Login unsuccessful `
      );
      res.status(500).json({});
    });
};

exports.signout = (req, res, next) => {
  winston.info("POST request /user/signout, cookie cleared");
  res.clearCookie("AUTH_TOKEN").redirect("/users/login");
};

exports.activation = (req, res) => {
  const activationCode = req.params.link;
  const userModel = new UserModel();

  userModel
    .activateAccount(activationCode)
    .then(data => {
      winston.info(
        `UsersController.get(users/activation/${activationCode}) -> succeeded: Activation successful `
      );
      res.redirect("/users/login");
    })
    .catch(err => {
      winston.error(
        `UsersController.get(users/activation/${activationCode}) -> failed: Could not activate the account `
      );
      res.redirect("/users/login");
    });
};
