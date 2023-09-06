const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const UserSchema = new mongoose.Schema({
    userName: { type: String, require:true},
    userMail: {type: String, unique:true},
    userPassword:{type:String},
    userPhone:{type:Number},
    gender:{type:String},
    address:{type:String},
    remember:{type:Boolean},
    date: { type: Date, default: Date.now },
})


module.exports = mongoose.model("User", UserSchema)