const Mongoose = require("mongoose");

let userSchema = Mongoose.Schema(
    {
    email: String,
    password: String,
    role:{
        type: String, enum: ['trainerHead', 'placementOfficer']
    }     
    }
);

var userModel =Mongoose.model("User", userSchema);
module.exports={userModel};