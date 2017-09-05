var mongoose = require("mongoose");

// mongodb setup
mongoose.connect('mongodb://localhost/yelpcamp', {useMongoClient: true});
mongoose.Promise = global.Promise;

// setup campgroundSchema
var campgroundSchema =  new mongoose.Schema({
    name: String,
    image: String,
    description: String,
    author:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    commentList: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        }
        ]
});
module.exports = mongoose.model("Campground", campgroundSchema);