var express    = require("express"),
    router     = express.Router(),
    Campground = require("../model/campground"),
    Comment    = require("../model/comments");


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
    res.render("campground/new");
});

// access to a specific campground id page
router.get("/index/:id", function(req, res){
    Campground.findById(req.params.id).populate("commentList").exec(function(err, campGround){
        if (err){
            console.log(err);
        }else{
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
            var newComment = new Comment({
                content: req.body.content,
                author: req.user._id,
                authorName: req.user.username
            });
            console.log(newComment);
            newComment.save(function (err, returnComment){
                if (err){
                    console.log(err);
                }else{
                    campGround.commentList.push(returnComment);
                    campGround.save();        
                    console.log(campGround.commentList);
                }
            })
            res.redirect("/index/" + req.params.id);
        }
    });
});


module.exports = router;