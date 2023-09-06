const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const OrderSchema = new mongoose.Schema({
    productName:[{type: Schema.Types.ObjectId, ref: "product"}],
    userMail:{type: Schema.Types.ObjectId, ref: "user"},
    orderName:{type:String},
    orderSurName:{type:String},
    orderCompany:{type:String},
    orderCountry:{type:String},
    orderStreet:{type:String},
    orderApartment:{type:String},
    orderCity:{type:String},
    orderHood:{type:String},
    orderPostCode:{type:Number},
    orderPhone:{type:Number},
    orderMail:{type:String},
    orderNote:{type:String},
    orderNumber:{type:Number},
    orderPayment:{type:String},
    orderPrice:{type:Number},
    date: { type: Date, default: Date.now },
})


module.exports = mongoose.model("Order", OrderSchema)