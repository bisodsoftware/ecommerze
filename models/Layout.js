const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const LayoutSchema = new mongoose.Schema({
    layoutName: { type: String, require:true},
    layoutTitle: { type: String, require:true},
    categoryName: {type: Schema.Types.ObjectId, ref: "category"},

})


module.exports = mongoose.model("Layout", LayoutSchema)