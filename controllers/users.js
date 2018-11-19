const UserModel = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.getSignup= (req, res, next)=> {
  res.render('auth/register')
}

exports.signup= (req, res, next) => {

  const user = new UserModel();

  var u;
  u.userName = req.body.name;
  u.userSurname = req.body.surname;
  u.email = req.body.email;
  u.birthdate = u.body.birthday;
  u.pass = req.body.password;

  user.register(u);
  /*
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
  }); */
}

exports.getLogin= (req,res, next)=>{
  res.render('auth/login');
  //res.send("chuj");
}
exports.login=  (req, res, next) => {

  // const user = new UserModel();
  //
  // var result = user.login(req.body.email, req.body.password)
  // .then(user =>{
  //   //if (user.userName!==undefinded)
  //   const token = jwt.sign(
  //     {
  //       email: req.body.email,// to be changed
  //       userId: user[0].ID
  //     },
  //     process.env.JWT_KEY,
  //     { expiresIn: "1h" }
  //   );
  //
  // })
  // .catch{
  //
  // };

  const user = new UserModel();

  var result = user.login(req.body.email, req.body.password)
  .then(user =>{
      if (user.length < 1) {
        return res.status(401).json({
          message: "Authenticatoin failed"
        });
      }
        if (result) {
          const token = jwt.sign(
            {
              email: req.body.email,
              userId: user[0].ID
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
