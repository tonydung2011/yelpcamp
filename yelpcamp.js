// Adding dependency
var express             = require("express"),
    app                 = express(),
    bodyParser          = require("body-parser"),
    passport            = require("passport"),
    localStrategy       = require("passport-local"),
    session             = require("express-session"),
    mongoose            = require("mongoose"),
    Campground          = require("./model/campground.js"),
    User                = require("./model/user.js");
    
// app configuration
// app.use(express.static(__dirname + "/public"));
mongoose.connect('mongodb://localhost/yelpcamp', {useMongoClient: true});
mongoose.Promise = global.Promise;
app.use(session({
    secret: "vo chong Kim Dung",
    resave: false,
    saveUninitialized: false
}));
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

function isLoggedIn(req, res, next){
    if (req.authenticate()){
        return next;
    }else{
        res.redirect("/login");
    }
}

// access to home page
app.get("/",function (req, res){
    res.render("homePage");
    console.log("homePage activates");
});

// access to campGround page
app.get("/index", function (req, res){
    console.log("campround page activates");
    Campground.find({},function(err, campGroundDB){
        if (err){
            console.log(err);
        }else{
            res.render("campground/index",{ campGrounds: campGroundDB});
        }
    });
});

// route of post request to make a new campground
app.post("/index", function (req, res){
  var newCampGround = new Campground({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description
  });
  newCampGround.save(function(err, savedCampGround){
      if (err){
          console.log(err);
      }else{
          console.log("campground saved");
      }
  });
  res.redirect("/index");
});

// access to page new camp ground
app.get("/index/new",function(req, res){
    res.render("campground/new");
});

// access to a specific campground id page
app.get("/index/:id", function(req, res){
    Campground.findById(req.params.id, function(err, campGround){
        if (err){
            console.log(err);
        }else{
            res.render("campground/show", {campGround: campGround});
        }
    });
});

// adding comment
app.post("/index/:id/comment", function(req, res){
    Campground.findById(req.params.id, function(err, campGround){
        if (err){
            console.log(err);
        }else
        {
            campGround.commentList.push(req.body.comment);
            campGround.save();
            res.redirect("/index/" + req.params.id);
        }
    });
});

////////////////
// AUTH ROUTE

// register
app.get("/register", function(req, res){
    res.render("register");
});

app.post("/register", function(req, res){
    var newUser = new User({username: req.body.username});
    User.register(newUser, req.body.password, function(err, user){
        if(err){
            console.log(err);
            return res.render("register");
        }
        passport.authenticate("local")(req, res, function(){
           res.redirect("/index"); 
        });
    });
});

// login
app.get("/login", function(req, res){
    res.render("login");
});

app.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/index",
        failureRedirect: "/login"
        
    }), function(req, res){
    console.log("login succeed");
});

//log out
app.get("/logout", function(req, res){
    req.logout();
    res.redirect("/index");
});


// request for a none existed page
app.get("*", function(req, res){
    res.send("opps look like you're looking for a page doesn't exist!");
});

app.listen(process.env.PORT,process.env.IP,function (){
    console.log("yelpcamp app has started!");
});