const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const CategorySchema = new mongoose.Schema({
    categoryName: { type: String, require:true},
    code: {type:Number},
    image:{type:String},
    categoryIcon:{type:String, require:true},
    date: { type: Date, default: Date.now },
    categoryDesc: {type:String},
    categoryLink:{type:String},
    mainPage:{type:Boolean}
})


module.exports = mongoose.model("Category", CategorySchema)