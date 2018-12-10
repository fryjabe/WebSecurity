const express = require("express");
const path = require("path");
const favicon = require("serve-favicon");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const multer = require("multer");
const flash = require("connect-flash");

// var csrf = require('csurf')
// var csrfProtection = csrf({ cookie: true })

var session = require("express-session");

require("dotenv").config();

var posts = require("./routes/posts");
var users = require("./routes/users");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(helmet());
app.use(helmet.referrerPolicy({ policy: "same-origin" }));

// specifying which headers and from where can the api be accessed
app.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Origin",
    `http://${config.ip}:${config.port}`
    // we should not put * because it means that anybody can access the api
  );
  res.header(
    "Access-Control-Allow-Headers",
    "X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self'; style-src 'self'"
  );
  next();
});

app.disable("x-powered-by");

const imageFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "file/jpg" ||
    file.mimetype === "image/jpeg"
  )
    cb(null, true);
  else cb(null, false);
};

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(multer({ storage: fileStorage, fileFilter: imageFilter }).single("image"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use("/images", express.static(path.join(__dirname, "images")));
app.use(
  session({ secret: "secretkeytodo", resave: false, saveUninitialized: false })
);

app.use(flash());

app.use("/posts", posts);
app.use("/users", users);
app.use("/", function(req, res, next) {
  res.redirect("users/login");
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
