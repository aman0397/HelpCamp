var mongoose = require("mongoose");
var passport_local_mongoose = require("passport-local-mongoose");

var user_schema = new mongoose.Schema(
    {
        username: String,
        password: String
    });
    
user_schema.plugin(passport_local_mongoose);
    
var User = mongoose.model("User", user_schema);
module.exports = User;