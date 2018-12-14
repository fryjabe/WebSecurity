const PostModel = require("../models/post");
const htmlencode = require("htmlencode");
const sanitize = require("sanitize-html");
const winston = require("../config/winston");
const jwt= require('jsonwebtoken');


exports.getPosts = (req, res, next) => {
  winston.info("GET request /posts");

  var post = new PostModel();

  post
    .feed()
    .then(docs => {
      winston.info(`UsersController.get(/posts) -> succeeded: Posts displayed`);

      res.render("posts/wall", {
        posts: docs.reverse(),
        path: "/",
        csrfToken: req.csrfToken()
      });
    })
    .catch(err => {
      winston.error(
        `PostsController.get(/posts) -> failed: Posts failed to display`
      );
      res.status(500).json({});
    });
};

exports.writePost = (req, res, next) => {
  winston.info("POST request /posts");
  var postModel = new PostModel();
  var content = sanitize(req.body.caption);
  
  const decoded=jwt.verify(req.cookies.Cookie, process.env.JWT_KEY);
  
  if (content === "" && req.file === undefined) {
    return;
  } else if (content === "" && req.file !== undefined) {
    var post = {
      userID: decoded.userId, 
      caption: "",
      link: req.file.path,
      postType: 0
    };
  } else if (content !== "" && req.file === undefined) {
    var post = {
      userID: decoded.userId, 
      caption: content,
      link: "",
      postType: 0
    };
  } else if (content !== "" && req.file !== undefined) {
    var post = {
      userID: decoded.userId, 
      caption: content,
      link: req.file.path,
      postType: 0
    };
  }

  postModel
    .createPost(post)
    .then(result => {
      winston.info(
        `PostsController.post(/posts) -> succedded: Post was created`
      );
    })
    .catch(err =>
      winston.error(
        `PostsController.post(/posts) -> failed: post was not created`
      )
    );

  // else{
  //   winston.error(
  //   `PostsController.post(/posts) -> failed: there was no content in the post field`
  //   )}
  res.status(201).redirect("/posts"); // error here
};
