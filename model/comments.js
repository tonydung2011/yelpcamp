var mongoose = require('mongoose');

var commentShema = new mongoose.Schema({
    content: String,
    author: 
    {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    authorName: String
});

module.exports = mongoose.model("Comment", commentShema);