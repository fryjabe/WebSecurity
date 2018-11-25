const mongoose = require("mongoose");
const PostModel = require("../models/post");

exports.getPosts = (req, res, next) => {

  var post = new PostModel()


  post.feed()
    .then(result => {
      console.log(result);

      res.render('posts/wall',{
         posts: result,
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
