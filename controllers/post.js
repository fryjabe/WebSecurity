const mongoose = require("mongoose");
const Post = require("../models/post");
var htmlencode = require('htmlencode');

exports.getPosts = (req, res, next) => {
  Post.find()
    .exec()
    .then(docs => {
      console.log(docs);
     // res.status(200).json(docs);
      
      res.render('posts/wall',{
        posts: docs.reverse(),
        path: '/'
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({});
    });
};

exports.writePost = (req, res, next) => {
  
  const post = new Post({
    _id: new mongoose.Types.ObjectId(),
    content: req.body.content
  });
  post
    .save()
    .then(result => {
      console.log(result);
    })
    .catch(err => console.log(err));
  res.status(201).redirect('/posts'); // error here
};
