var mongoose = require("mongoose");

var campground_schema = new mongoose.Schema(
    {
        name: String,
        image: String,
        price: String,
        description: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        },
        comments: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Comment"
            }
        ]
    });
var Campground = mongoose.model("Campground", campground_schema);
module.exports = Campground;