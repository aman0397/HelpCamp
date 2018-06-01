var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");

//INDEX - show all campgrounds
router.get("/campgrounds",function(req, res)
{
    //Get all the campgrounds form the DB
    Campground.find({}, function(err, campgrounds)
    {
        if(err)
        {
            console.log(err);
        }
        else
        {
            res.render("campgrounds/index",{campgrounds: campgrounds});
        }
    });
});

//CREATE - add new campgrounds to database.
router.post("/campgrounds", is_loggedin, function(req,res)
{
    var name = req.body.name;
    var image = req.body.image;
    var price = req.body.price;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    };
    var new_camp_ground = {name : name, price: price, image: image, description: description, author: author};
    // Create a new campground and save it to the DB
    Campground.create(new_camp_ground, function(err, campground)
    {
        if(err)
            console.log(err);
        else{
            //redirect to campgrounds page.
            res.redirect("/campgrounds");
        }
    });
    // campgrounds.push(new_camp_ground);
});

//NEW - show form to create new campground.
router.get("/campgrounds/new", is_loggedin, function(req, res)
{
    res.render("campgrounds/new");
});

//SHOW - shows more information about one campground.
router.get("/campgrounds/:id", function(req, res)
{
    //find the campground with the specified ID.
    Campground.findById(req.params.id).populate("comments").exec(function(err, found_campground)
    {
        if(err)
            console.log(err);
        else
        {
            console.log("found campground");
            //render show template with that campground.
            res.render("campgrounds/show",{campground: found_campground});
        }
    });
});

//EDIT CAMPGROUND ROUTE
router.get("/campgrounds/:id/edit", check_campground_ownership, function(req, res)
{
    Campground.findById(req.params.id, function(err, found_campground)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            res.render("campgrounds/edit", {campground: found_campground});
        }
    });
});

//UPDATE CAMPGROUND ROUTE
router.put("/campgrounds/:id", check_campground_ownership, function(req, res)
{
    //find and update the correct campground
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updated_campground)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
    //then redirect to show page.
});

//DESTROY CAMPGROUND ROUTE
router.delete("/campgrounds/:id", check_campground_ownership, function(req, res)
{
    Campground.findByIdAndRemove(req.params.id, function(err)
    {
        if(err)
        {
            res.redirect("/campgrounds");
        }
        else
            res.redirect("/campgrounds");
    });
});


//Middleware
function is_loggedin(req, res, next)
{
    if(req.isAuthenticated())
    {
        return next();
    }
    req.flash("error", "Please Login First!");
    res.redirect("/login");
}

function check_campground_ownership(req, res, next)
{
    //If User is logged In
    if(req.isAuthenticated())
    {
        Campground.findById(req.params.id, function(err, found_campground)
        {
            if(err)
            {
                req.flash("error", "Interest not found");
                res.redirect("back");
            }
            else
            {
                //Does the User own the campground?
                // console.log(found_campground.author.id);
                // console.log(req.user._id);
                if(found_campground.author.id.equals(req.user._id))
                {
                    next();
                }
                else
                {
                    req.flash("error", "You do not have the permission to do that");
                    res.redirect("back");
                }
            }
        });
    }
    else
    {
        req.flash("error", "You need to be logged in to do that");
        res.redirect("back");
    }
}

module.exports = router;