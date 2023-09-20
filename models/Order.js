const mongoose = require("mongoose")
const { Schema } = require("mongoose")


const OrderItemSchema = new mongoose.Schema({
    productName:{type: Schema.Types.ObjectId, ref: "product"},
    quantity: {type:Number}
})

const OrderSchema = new mongoose.Schema({
    orderNumber:{type:String, default:10000},
    items:[OrderItemSchema],
    userMail:{type: Schema.Types.ObjectId, ref: "user"},
    orderName:{type:String},
    orderSurName:{type:String},
    orderCompany:{type:String},
    orderCountry:{type:String},
    orderAddress:{type:String},
    orderCity:{type:String},
    orderHood:{type:String},
    orderPostCode:{type:Number},
    orderPhone:{type:Number},
    orderMail:{type:String},
    orderNote:{type:String},
    orderNumber:{type:Number},
    orderPayment:{type:String},
    orderPrice:{type:Number},
    orderStatus:{type:String},
    orderTrackNumber:{type:String},
    date: { type: Date, default: Date.now },
})


module.exports = mongoose.model("Order", OrderSchema)