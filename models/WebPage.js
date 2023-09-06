const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const WebPageSchema = new mongoose.Schema({
    webName: { type: String},
    webDesc: { type: String},
    webLink: { type: String},
    webIcon: {type:String},
    webIco: {type:String},
    phoneNumber:{type:Number},
    mailAddress:{type:String},
    address:{type:String},
    profileFacebook:{type:String},
    profileInstagram:{type:String},
    profileLinkedin:{type:String},
    profileTwitter:{type:String},
    profileYoutube:{type:String},
    webMainPageFirstImage:{ type:String,},
    webMainPageFirstImageTopText:{type:String},
    webMainPageFirstImageMainText:{type:String},
    webMainPageFirstImageBottomText:{type:String},
    webMainPageFirstImageLink:{type:String},
    webMainPageFirstImageBgColor:{type:String},
    webMainPageSecondImage:{ type:String,},
    webMainPageSecondImageTopText:{type:String},
    webMainPageSecondImageMainText:{type:String},
    webMainPageSecondImageBottomText:{type:String},
    webMainPageSecondImageLink:{type:String},
    webMainPageSecondImageBgColor:{type:String},
    webMainPageThirdImage:{ type:String,},
    webMainPageThirdImageTopText:{type:String},
    webMainPageThirdImageMainText:{type:String},
    webMainPageThirdImageBottomText:{type:String},
    webMainPageThirdImageLink:{type:String},
    webMainPageThirdImageBgColor:{type:String},
    webMainPageFirstSection:{type:String},
    webMainPageSecondSection:{type:String},
    webMainPageThirdSection:{type:String},
    webMainPageFourthSection:{type:String},
    webMainPageFifthSection:{type:String},
    webMainPageSixthSection:{type:String},
    webMainPageSeventhSection:{type:String},
    webMainPageEightSection:{type:String},
    webMainPageNinthSection:{type:String},
    webMainPageTenthSection:{type:String},
    webMainPageEleventhSection:{type:String},
    date: { type: Date, default: Date.now },
})


module.exports = mongoose.model("WebPage", WebPageSchema)