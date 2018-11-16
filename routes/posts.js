var express = require("express");
var router = express.Router();
const checkAuth= require('../middleware/check-auth');
const postController= require('../controllers/post');

/* GET users messages. */
router.get('/', postController.getPosts);

/* Posts users message. */
router.post("/", postController.writePost); // add ,checkAuth

module.exports = router;
