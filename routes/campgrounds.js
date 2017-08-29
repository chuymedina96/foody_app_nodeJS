var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground.js");
//Check to see if user is logged in
function isLoggedin(req, res, next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/login");
};

router.get("/", function(req, res){
    Campground.find({}, function(err, allCampgrounds){
        if(err){
            console.log("There has been an error!");
            console.log(err);
        } else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    });
});
//New post route
router.get("/new", isLoggedin, function(req,res){
    res.render("campgrounds/new");
});
//Post route for New Post form
router.post("/", isLoggedin, function(req, res){
    var name = req.body.name;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
      id: req.user._id,
      username: req.user.username
    };
    var newGround = {name: name, image: image, description: description, author: author};
    Campground.create(newGround, function(err, newlyCreated){
      console.log(req.user);
        if(err){
            console.log(err);
        } else{
          console.log(newlyCreated);
            res.redirect("/campgrounds");
        }
    });
});
//Show route for posts
router.get("/:id", function(req, res){
    // POPULATES THE COMMENTS PART OF THE CAMPGROUND SCHEMA WITH
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else{
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

module.exports = router;