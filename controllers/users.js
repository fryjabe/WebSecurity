const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getSignup= (req, res, next)=> {
  res.render('auth/register')
}

exports.signup= (req, res, next) => {

  var user=new UserModel();

  var u ={
    name: req.body.name,
    email: req.body.email,
    pass: req.body.password
  }


  user.register(u);

}

exports.getLogin= (req,res, next)=>{
  res.render('auth/login');

}
exports.login= (req, res, next) => {

  const user = new UserModel();

  user.login(req.body.email, req.body.password)
      .then(result => {

        if(!result){
          console.log("TODO: User or password incorrect");
          return res.status(401).json({ message: "Authorisation failed" });
        }
        //if(!result.verified) console.log("Account not verified. Check email");

        else{
          console.log("TODO: Login successful - Return key");
          const token = jwt.sign(
            {
              email: req.body.email,
              userId: result.ID
            },
            process.env.JWT_KEY,
            { expiresIn: "1h" }
          );
          return res
            .status(200)
            .json({ message: "Authorisation successfull", token: token });
        }

      })
      .catch(err =>{
        console.log(err);
      });
}
