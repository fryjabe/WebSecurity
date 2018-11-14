var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
const checkAuth= require('../middleware/check-auth');

const Post = require("../models/post");
/* GET users messages. */
router.get("/", function(req, res, next) {
  Post.find()
    .exec()
    .then(docs => {
      res.status(200).json(docs);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({});
    });
});

/* Posts users message. */
router.post("/",checkAuth, function(req, res, next) {
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
  res.status(201).json({
    message: "posted"
  });
});

module.exports = router;
