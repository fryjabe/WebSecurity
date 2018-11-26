
const PostModel = require("../models/post");
const htmlencode = require("htmlencode");
const sanitize = require("sanitize-html");

exports.getPosts = (req, res, next) => {

  var post = new PostModel();

  post.feed()
    .then(docs => {

      console.log(docs);
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

  var postModel = new PostModel();

  var content = sanitize(req.body.caption);
  

  //TODO: Check more stuff
  if (content !== "") {

    var post = {
      userID: 1, //TODO: Use current user in cookie
      caption: content,
      link: "",
      postType: 0
    }

    console.log("HELLO THERE");

    postModel.createPost(post)
        .then(result => {
          console.log(result);
        })
        .catch(err => console.log(err));

  }

  //else{error}
  res.status(201).redirect("/posts"); // error here
};
