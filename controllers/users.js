const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

var sanitize = require("sanitize-html");
//var csrf = require('csurf')
//var csrfProtection = csrf({ cookie: true })

//const { validationResult } = require('express-validator/check');

const PASS_REG = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{6,12}$/;
const MAIL_REG = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;




exports.getSignup= (req, res, next)=> {
  res.render('auth/register',{
    csrfToken: req.csrfToken(),
    errorMessage: req.flash('error')
  })
}

exports.signup= (req, res, next) => {

  var user=new UserModel();

  var u ={
    name: sanitize(req.body.name),
    email: sanitize(req.body.email),
    pass: sanitize(req.body.password)
  }

  if(u.name == ""){

    req.flash('error', 'Username field cannot be empty');
    return res.redirect(("/users/signup"));

  }

  else if(u.email==""){
    req.flash('error', 'Email field cannot be empty');
    return res.redirect(("/users/signup"));

  }

  else if(!MAIL_REG.test(u.email)){
    req.flash('error', 'Invalid email');
    return res.redirect(("/users/signup"));
  }

  else if(!PASS_REG.test(u.pass)){
    req.flash('error', 'Invalid password: 6-12 characters, numbers and letters uppercase and lowercase');
    return res.redirect(("/users/signup"));
  }

  else if(u.pass != sanitize(req.body.repassword)){
    req.flash('error', 'Password confirmation does not match the password');
    return res.redirect(("/users/signup"));
  }

  else user.register(u)
      .then(result => {
        res.status(201).redirect("/users/login");
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({});
      });

}

exports.getLogin= (req,res, next)=>{
  res.render('auth/login',{
    csrfToken: req.csrfToken(),
    errorMessage: req.flash('error')
  });
}

exports.login=  (req, res, next) => {

  const user = new UserModel();

  var mail = sanitize(req.body.email);
  var pass = sanitize(req.body.password);

  user.login(mail, pass)
      .then(result => {

        if(!result){

          req.flash('error', 'User or password incorrect');
          return res.redirect(("/users/login"));
        }
        if(!result.verified){

          req.flash('error', 'User not verified. Check email');
          return res.redirect(("/users/login"));
        }

        else{
          console.log("Login successful");
          const token = jwt.sign(
            {
              email: mail,
              userId: result.ID
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );

          res.cookie('Cookie', token, { maxAge: 3600000, httpOnly: true });
          return res.redirect("../posts");
        }

        req.flash('error', 'Authentification failed');
        return res.redirect(("/users/login"));

      })
      .catch(err =>{
        console.log(err);
        res.status(500).json({});
      });

  }



  exports.signout= (req, res,next) => {
    res.clearCookie("AUTH_TOKEN").redirect('/users/login');
  }

  exports.activation=(req, res) => {
    const activationCode = req.params.link;
    const userModel = new UserModel();

    userModel.activateAccount(activationCode)
        .then((data) => {
            res.redirect('/users/login')
        })
        .catch((err) => {
            console.log("err2");

            res.redirect('/users/login')

        })
}
