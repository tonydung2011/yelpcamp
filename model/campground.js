var mongoose = require("mongoose");

// mongodb setup
mongoose.connect('mongodb://localhost/yelpcamp', {useMongoClient: true});
mongoose.Promise = global.Promise;

// setup campgroundSchema
var campgroundSchema =  new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    commentList: [
        {
            content: String,
            author: String
        }
        ]
});
module.exports = mongoose.model("Campground", campgroundSchema);