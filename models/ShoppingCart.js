const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const OrderItemSchema = new mongoose.Schema({
    productName:{type: Schema.Types.ObjectId, ref: "product"},
    quantity: {type:Number}
})

const ShoppingCartSchema = new mongoose.Schema({
    userMail:{type: Schema.Types.ObjectId, ref: "user"},
    userId:{type:String},
    items:[OrderItemSchema],
    date: { type: Date, default: Date.now },
})


module.exports = mongoose.model("ShoppingCart", ShoppingCartSchema)