var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
var csrf = require('csurf');
const RateLimit = require('express-rate-limit');

const limiter = new RateLimit({
    windowMs: 15 * 60 * 1000, // block access 15min
    max: 3, // limit each IP to 50 requests
    delayMs: 0, // disable delaying - full speed until the max limit is reached
    message: "Too many request! Access blocked for 15 minutes"
  });
  
  
var csrfProtection = csrf();
router.use(csrfProtection);

const usersController = require("../controllers/users");
/* GET users listing. */

router.get("/signup", usersController.getSignup);

router.post("/signup", usersController.signup); // no brackets ?

router.get("/login", usersController.getLogin);

router.post("/login",limiter, usersController.login); // no brackets ?

router.get('/signout', usersController.signout);

router.get('/activation/:link', usersController.activation);


module.exports = router;
