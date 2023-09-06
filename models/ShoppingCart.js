const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const ShoppingCartSchema = new mongoose.Schema({
    userMail:{type: Schema.Types.ObjectId, ref: "user"},
    productName:[{type: Schema.Types.ObjectId, ref: "product"}],
    date: { type: Date, default: Date.now },
})


module.exports = mongoose.model("ShoppingCart", ShoppingCartSchema)