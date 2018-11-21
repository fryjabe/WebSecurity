const mongoose = require("mongoose");
const Post = require("../models/post");
var htmlencode = require("htmlencode");
var sanitize = require("sanitize-html");

exports.getPosts = (req, res, next) => {
  Post.find()
    .exec()
    .then(docs => {
      // res.status(200).json(docs);

      res.render("posts/wall", {
        posts: docs.reverse(),
        path: "/",
        csrfToken: req.csrfToken()
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({});
    });
};

exports.writePost = (req, res, next) => {
  if (sanitize(req.body.content) !== "") {
    const post = new Post({
      _id: new mongoose.Types.ObjectId(),
      content: sanitize(req.body.content) // do we want to strip all the script tags?
    });
    post
      .save()
      .then(result => {
        console.log(result);
      })
      .catch(err => console.log(err));
  }
  res.status(201).redirect("/posts"); // error here
};
