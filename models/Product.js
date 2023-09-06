const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const ProductSchema = new mongoose.Schema({
    productName: { type: String, require:true},
    amount:{type:Number},
    oldPrice: { type: Number, require:true},
    newPrice: { type: Number},
    categoryName: {type: Schema.Types.ObjectId, ref: "category"},
    code: {type:Number},
    image:[{type:String, require:true}],
    date: { type: Date, default: Date.now },
    productDesc: {type:String},
    trendingProd:{type:Boolean},
    banner:{type:Boolean},
    dealOftheDay:{type:Boolean},
    productGadget:{type:Boolean},
    bannerProd:{type:Boolean},
    discountProd:{type:Boolean},
    featuredProd:{type:Boolean},
    sellingProd:{type:Boolean},
})


module.exports = mongoose.model("Product", ProductSchema)