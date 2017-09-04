var express    = require("express"),
    router     = express.Router(),
    Campground = require("../model/campground"),
    User       = require("../model/user"),
    passport   = require("passport");


function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

// access to home page
router.get("/",function (req, res){
    res.render("homePage");
    console.log("homePage activates");
});


////////////////
// AUTH ROUTE

// register
router.get("/register", function(req, res){
    res.render("register");
});

router.post("/register", function(req, res){
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
router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/index",
        failureRedirect: "/login"
        
    }), function(req, res){
    console.log("login succeed");
});

//log out
router.get("/logout", function(req, res){
    req.logout();
    res.redirect("/index");
});

// request for a none existed page
router.get("*", function(req, res){
    res.send("opps look like you're looking for a page doesn't exist!");
});

module.exports = router;