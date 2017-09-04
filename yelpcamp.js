// Adding dependency
var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    passport            = require("passport"),
    localStrategy       = require("passport-local"),
    session             = require("express-session"),
    mongoose            = require("mongoose");
    
var Campground          = require("./model/campground.js"),
    User                = require("./model/user.js");
    
var campgroundRoute     = require("./routes/campgrounds"),
    indexRoute          = require("./routes/index");
    
    
// app configuration
//|| "mongodb://localhost/yelpcamp"
var url = process.env.DATABASEURL ;
mongoose.connect(url, {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(session({
    secret: "vo chong Kim Dung",
    resave: false,
    saveUninitialized: false
}));
app.use(express.static(__dirname + "/public"));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// using body-parser
app.use(bodyParser.urlencoded({ extended: true }));

// set up for views resources
app.set("view engine", "ejs");
  
  
// reset app
// var campGroundsArray = require("./model/dataGenerator.js");   
// campGroundsArray.forEach(function(campGroundIterator){
//     var tempCG = new Campground({
//         name: campGroundIterator.name,
//         image: campGroundIterator.image,
//         description: campGroundIterator.description,
//         commentList: []
//     });
//     tempCG.save(function(err, savedCG){
//         if (err){
//             console.log(err);
//         }else{
//             console.log(savedCG);
//         }
//     });
// });

// setup middle ware use for every route
app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    next();
});

// using route
app.use(campgroundRoute);
app.use(indexRoute);


app.listen(process.env.PORT,process.env.IP,function (){
    console.log("yelpcamp app has started!");
});