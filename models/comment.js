var mongoose = require("mongoose");

var comment_schema = new mongoose.Schema(
    {
        text: String,
        author: {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            username: String
        }
    });
var Comment = mongoose.model("Comment",comment_schema);
module.exports = Comment;