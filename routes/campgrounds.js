var express    = require("express"),
    router     = express.Router(),
    Campground = require("../model/campground"),
    Comment    = require("../model/comments");

var middleware = require("../middleware/index.js");

// access to campGround page
router.get("/", function (req, res){
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
router.post("/", middleware.isLoggedIn, function (req, res){
  var newCampGround = new Campground({
      name: req.body.name,
      image: req.body.image,
      description: req.body.description,
      author: req.user
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
router.get("/new", middleware.isLoggedIn ,function(req, res){
    res.render("campground/new");
});

// access to a specific campground id page
router.get("/:id", function(req, res){
    Campground.findById(req.params.id).populate("commentList").populate("author").exec(function(err, campGround){
        if (err){
            console.log(err);
        }else{
            res.render("./campground/show", {campGround: campGround});
        }
    });
});

//edit route
router.get("/:id/edit", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
        }else{
            
                res.render("./campground/edit", {htmlCampground: foundCampground});
            
        }
    })
})

//update route
router.put("/:id", middleware.isLoggedIn, function(req, res){
    console.log("hit put route");
    Campground.findById(req.params.id, function(err, foundCampground){
        if (err){
            console.log(err);
        }else{
            foundCampground.name        = req.body.updateCampground.name;
            foundCampground.image       = req.body.updateCampground.image;
            foundCampground.description = req.body.updateCampground.description;
            foundCampground.save();
        }
        res.redirect("/index/"+req.params.id);
    })
})

// delete route
router.delete("/:id", function(req, res){
    console.log("hit delete route");
    Campground.findByIdAndRemove(req.params.id, function(err){
        if (err){
            console.log(err);
        }else{
            console.log("delete done");
        }
        res.redirect("/index");
    })
})

// adding comment
router.post("/:id/comment", middleware.isLoggedIn, function(req, res){
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