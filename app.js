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

// Campground.create(
//     {
//         name: "Mandi", 
//         image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzRjg5uscOM3Tdntvd1LgJPpj8rpBc2mL0V9dwoGquCBqX1Dgr3Q",
//         description: "This is the Prashar Lake Trek. It has both picturesque as well as religious significance"
//     }, function(err, campground)
//     {
//       if(err)
//       {
//           console.log(err);
//       }
//       else
//       {
//           console.log("Newly created campground: ");
//           console.log(campground);
//       }
//     });


// var campgrounds =[
//       {name: "Kheerganga", image:"http://monkinshorts.com/wp-content/uploads/2017/03/kheerganga_camps.jpg"},
//       {name: "Mandi", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzRjg5uscOM3Tdntvd1LgJPpj8rpBc2mL0V9dwoGquCBqX1Dgr3Q"},
//       {name: "Rishikesh", image:"https://static2.tripoto.com/media/filter/nl/img/7372/TripDocument/1503751976_a_camp_site_by_the_ganga_rishikesh.jpg"},
//       {name: "Kheerganga", image:"http://monkinshorts.com/wp-content/uploads/2017/03/kheerganga_camps.jpg"},
//       {name: "Mandi", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzRjg5uscOM3Tdntvd1LgJPpj8rpBc2mL0V9dwoGquCBqX1Dgr3Q"},
//       {name: "Rishikesh", image:"https://static2.tripoto.com/media/filter/nl/img/7372/TripDocument/1503751976_a_camp_site_by_the_ganga_rishikesh.jpg"},
//       {name: "Kheerganga", image:"http://monkinshorts.com/wp-content/uploads/2017/03/kheerganga_camps.jpg"},
//       {name: "Mandi", image:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzRjg5uscOM3Tdntvd1LgJPpj8rpBc2mL0V9dwoGquCBqX1Dgr3Q"},
//       {name: "Rishikesh", image:"https://static2.tripoto.com/media/filter/nl/img/7372/TripDocument/1503751976_a_camp_site_by_the_ganga_rishikesh.jpg"}
//     ];