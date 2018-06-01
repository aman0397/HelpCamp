var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");

//===============
//Comments ROUTES
//===============

//Comments new
router.get("/campgrounds/:id/comments/new", is_loggedin, function(req, res)
{
    //find campground by id.
    Campground.findById(req.params.id, function(err, campground)
    {
        if(err)
        {
            req.flash("error", "something went wrong");
            console.log(err);
        }
        else
        {
            res.render("comments/new", {campground: campground});
        } 
    });
});

//Comments Create
router.post("/campgrounds/:id/comments", is_loggedin, function(req, res)
{
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, campground)
    {
        if(err)
        {
            console.log(err);
            res.redirect("/campgrounds");
        }
        else
        {
            //create new comment
            Comment.create(req.body.comment, function(err, comment)
            {
                if(err)
                {
                    req.flash("error", "something went wrong");
                    console.log(err);
                }
                else
                {
                    //add username and id to comment
                    comment.author.id = req.user._id;
                    comment.author.username = req.user.username;
                    //save comment
                    comment.save();
                    //connect new comment to campground
                    campground.comments.push(comment);
                    campground.save();
                    //redirect to campground show page
                    console.log(comment);
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
        }
    });
});


//EDIT ROUTE FOR COMMENTS
router.get("/campgrounds/:id/comments/:comment_id/edit", check_comment_ownership, function(req, res)
{
    Comment.findById(req.params.comment_id, function(err, found_comment)
    {
        if(err)
        {
            req.flash("error", "something went wrong");
            res.redirect("back");
        }
        else
        {
            res.render("comments/edit", {campground_id: req.params.id, comment: found_comment});
        }
    });
});

//UPDATE ROUTE FOR COMMENTS
router.put("/campgrounds/:id/comments/:comment_id", check_comment_ownership, function(req, res)
{
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updated_comment)
    {
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//COMMENT DESTROY ROUTE
router.delete("/campgrounds/:id/comments/:comment_id", check_comment_ownership, function(req, res)
{
    Comment.findByIdAndRemove(req.params.comment_id, function(err)
    {
        console.log("reached here");
        if(err)
        {
            res.redirect("back");
        }
        else
        {
            req.flash("success", "Comment successfully deleted");
            res.redirect("/campgrounds/" + req.params.id);
        }
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

function check_comment_ownership(req, res, next)
{
    //If User is logged In
    if(req.isAuthenticated())
    {
        Comment.findById(req.params.comment_id, function(err, found_comment)
        {
            if(err)
            {
                req.flash("error", "Interest not found");
                res.redirect("back");
            }
            else
            {
                //Does the User own the comment?
                // console.log(found_campground.author.id);
                // console.log(req.user._id);
                if(found_comment.author.id.equals(req.user._id))
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