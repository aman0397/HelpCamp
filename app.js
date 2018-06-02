var express = require("express");
var app = express();
var request = require("request");
var body_parser = require("body-parser");
var mongoose = require("mongoose");
var Campground = require("./models/campground");
var seedDB = require("./seeds");
var Comment = require("./models/comment");
var passport = require("passport");
var local_strategy = require("passport-local");
var User = require("./models/user");
var method_override = require("method-override");
var flash = require("connect-flash");

//Requiring routes
var comment_routes = require("./routes/comments");
var campground_routes = require("./routes/campgrounds");
var index_routes = require("./routes/index");

//seedDB();  //Seed the database
mongoose.connect("mongodb://localhost/yelp_camp_final");
app.use(body_parser.urlencoded({extended: true}));
app.set("view engine","ejs");
app.use(express.static(__dirname + "/public"));
app.use(method_override("_method"));
app.use(flash());
// PASSPORT CONFIGURATION
app.use(require("express-session")(
    {
        secret: "Pluto is titled a planet once again",
        resave: false,
        saveUninitialized: false
    }));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new local_strategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next)
{
    res.locals.current_user = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

app.use(index_routes);
app.use(campground_routes);
app.use(comment_routes);

app.listen(process.env.PORT, process.env.IP, function()
{
    console.log("The server has started!");
});
