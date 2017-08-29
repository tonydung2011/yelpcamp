var mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

// mongodb setup


// setup campgroundSchema
var UserSchema =  new mongoose.Schema({
    username: String
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);