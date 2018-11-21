var express = require("express");
var path = require("path");
var favicon = require("serve-favicon");
var logger = require("morgan");
var cookieParser = require("cookie-parser");
var bodyParser = require("body-parser");
// var csrf = require('csurf')
// var csrfProtection = csrf({ cookie: true })


var session= require('express-session');


require('dotenv').config()


var mongoose = require("mongoose");
var posts = require("./routes/posts");
var users = require("./routes/users");

var app = express();

mongoose.connect(
  "mongodb+srv://fryjabe:kaszanka123@web-security-u3lnl.mongodb.net/test?retryWrites=true"
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

// specifying which headers and from where can the api be accessed
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    `*` 
    // we should not put * because it means that anybody can access the api
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );
  res.setHeader('Content-Security-Policy', "script-src 'self'; style-src 'self'")
  next();
});

app.disable('x-powered-by')

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(session({secret: 'secretkeytodo',resave: false, saveUninitialized: false}));
app.use("/posts", posts);
app.use("/users", users);
app.use("/", function(req, res, next) {
res.redirect('users/login');

});

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error("Not Found");
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("404");
});

module.exports = app;

