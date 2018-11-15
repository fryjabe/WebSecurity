var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const usersController = require("../controllers/users");
/* GET users listing. */

router.get("/signup", usersController.getSignup);

router.post("/signup", usersController.signup); // no brackets ?

router.get("/login", usersController.getLogin);

router.post("/login", usersController.login); // no brackets ?

module.exports = router;
