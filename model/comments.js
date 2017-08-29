var mongoose = require('mongoose');

var commentShema = new mongoose.Schema({
    content: String,
    author: String,
});

module.exports = mongoose.model("Comment", commentShema);