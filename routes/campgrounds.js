var express    = require("express"),
    router     = express.Router(),
    Campground = require("../model/campground");


function isLoggedIn(req, res, next){
    if (req.isAuthenticated()){
        return next();
    }else{
        res.redirect("/login");
    }
}

// access to campGround page
router.get("/index/", function (req, res){
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
router.post("/index/", isLoggedIn, function (req, res){
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
router.get("/index/new", isLoggedIn ,function(req, res){
    console.log("rending form");
    res.render("campground/new");
});

// access to a specific campground id page
router.get("/index/:id", function(req, res){
    console.log("ready to connect to campground");
    Campground.findById(req.params.id, function(err, campGround){
        if (err){
            console.log(err);
        }else{
            console.log("render show page");
            res.render("./campground/show", {campGround: campGround});
        }
    });
});

// adding comment
router.post("/index/:id/comment", isLoggedIn, function(req, res){
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


module.exports = router;