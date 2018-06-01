var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

//ROOT route
router.get("/",function(req, res)
{
    res.render("landing");
});

//=============
//AUTH ROUTES
//=============

//show registeration form
router.get("/register", function(req, res)
{
    res.render("register");
});

//Handle Sign Up logic
router.post("/register", function(req, res)
{
    var new_user = new User({username: req.body.username});
    User.register(new_user, req.body.password, function(err,user)
    {
        if(err)
        {
            req.flash("error", err.message);
            res.redirect("/campgrounds");
        }
        passport.authenticate("local")(req, res, function()
        {
            req.flash("success", "Welcome to HelpCamp " + user.username);
            res.redirect("/campgrounds");
        });
    });
});

// show login form
router.get("/login", function(req, res)
{
    res.render("login");
});

// Handling Login Logic
router.post("/login", passport.authenticate("local", 
    {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
    }), function(req, res)
{});

//Logout Route
router.get("/logout", function(req, res)
{
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});


//===========
//ABOUT ROUTE
//===========
router.get("/about", function(req, res)
{
    res.render("about");
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

module.exports = router;