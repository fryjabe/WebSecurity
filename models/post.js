const mongoose= require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    content: String
});

module.exports= mongoose.model('Post', postSchema);