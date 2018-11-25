const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
//var csrf = require('csurf')
//var csrfProtection = csrf({ cookie: true })



exports.getSignup= (req, res, next)=> {
  res.render('auth/register',{csrfToken: req.csrfToken()})
}

exports.signup= (req, res, next) => {

  var user=new UserModel();

  var u ={
    name: req.body.name,
    email: req.body.email,
    pass: req.body.password
  }


  user.register(u)
      .then(result => {
        res.status(201).redirect("/users/login");
      })
      .catch(err => {
        console.log(err);
        res.status(500).json({});
      });

}

exports.getLogin= (req,res, next)=>{
  res.render('auth/login',{csrfToken: req.csrfToken()});
}

exports.login=  (req, res, next) => {

  const user = new UserModel();

  user.login(req.body.email, req.body.password)
      .then(result => {

        if(!result){

          return res.status(401).json({ message: "User or password incorrect" });
        }
        //if(!result.verified){
        //  return res.status(401).json({ message: "User not verified. Check email" });
        //}

        else{
          console.log("Login successful");
          const token = jwt.sign(
            {
              email: req.body.email,
              userId: result.ID
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );

          res.cookie('Cookie', token, { maxAge: 3600000, httpOnly: true });
          return res.redirect("../posts");
        }

        return res.status(401).json({ message: "Authorisation failed" });

      })
      .catch(err =>{
        console.log(err);
        res.status(500).json({});
      });

  }



  exports.signout= (req, res,next) => {
    res.clearCookie("AUTH_TOKEN").redirect('/users/login');
  }
