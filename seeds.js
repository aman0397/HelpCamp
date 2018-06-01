var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment = require("./models/comment");

var data = [
    {
        name: "Kheerganga", 
        image: "http://monkinshorts.com/wp-content/uploads/2017/03/kheerganga_camps.jpg",
        description: "This is the first campground I had been to"
    },
    {
        name: "Mandi", 
        image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRzRjg5uscOM3Tdntvd1LgJPpj8rpBc2mL0V9dwoGquCBqX1Dgr3Q",
        description: "This is the second campground I had been to. This is the Prashar Lake Trek."
    },
    {
        name: "Rishikesh", 
        image: "https://static2.tripoto.com/media/filter/nl/img/7372/TripDocument/1503751976_a_camp_site_by_the_ganga_rishikesh.jpg",
        description: "This is Rishikesh campground. We had gone there during an improptu plan."
    }
];

function seedDB()
{
    //Remove campgounds
    Campground.remove({}, function(err)
    {
        if(err)
            console.log(err);
        else
        {
            console.log("removed campgrounds");
            //add a few campgrounds
            data.forEach(function(seed)
            {
                Campground.create(seed, function(err,campground)
                {
                    if(err)
                        console.log(err);
                    else
                    {
                        console.log("added a campground");
                        //Create a comment
                        Comment.create(
                            {
                                text: "This is an amazing camp. It really rejuvinutes us,",
                                author: "Carl"
                            }, function(err, comment)
                            {
                                if(err)
                                    console.log(err);
                                else
                                {
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Created new comment");
                                }
                            });
                    }
                });
            });
        }
    });
    
}

module.exports = seedDB;