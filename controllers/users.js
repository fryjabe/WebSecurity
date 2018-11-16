const mongoose = require("mongoose");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getSignup= (req, res, next)=> {
  res.render('auth/register')
}

exports.signup= (req, res, next) => {
  bcrypt.hash(req.body.password, 10, (err, hash) => {
    if (err) {
      return res.status(500).json({}); //add message
    } else {
      console.log(hash);
      const user = new User({
        _id: new mongoose.Types.ObjectId(),
        email: req.body.email,
        password: hash
      });
      user
        .save()
        .then(result => {
          res.status(201).json({ message: "User created" });
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({});
        });
    }
  });
}

exports.getLogin= (req,res, next)=>{
  res.render('auth/login');
  //res.send("chuj");
}
exports.login=  (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Authenticatoin failed"
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({ message: "Authorisation failed" });
        }
        if (result) {
          const token = jwt.sign(
            {
              email: user[0].email,
              userId: user[0]._id
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          return res
            .status(200)
            .json({ message: "Authorisation successfull", token: token });
        }
        return res.status(401).json({ message: "Authorisation failed" });
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({});
    });
  }