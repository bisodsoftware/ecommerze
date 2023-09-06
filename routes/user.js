const express = require("express");
const router = express.Router();
const { text } = require("body-parser");
const User = require("../models/User.js");
const Category = require("../models/Category.js");
const WebPage = require("../models/WebPage.js");
const ShoppingCart = require("../models/ShoppingCart.js")

const path = require("path");

function loadNavbarCategories(req, res, next) {
  Category.find({})
    .lean()
    .then((navbarCategories) => {
      WebPage.findOne({ _id: "64e8d2cce47f9664533fc798" })
        .lean()
        .then((webpageGeneral) => {
          req.webpageGeneral = webpageGeneral;
          req.navbarCategories = navbarCategories;
          next();
        });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
}

router.use(loadNavbarCategories);

router.get("/giris", (req, res) => {
  if (req.session.userId) {
    res.redirect("/profil");
  } else {
    res.render("site/login", {
      navbarCategories: req.navbarCategories,
      webpageGeneral: req.webpageGeneral,
    });
  }
});
router.get("/kayitol", (req, res) => {
  if (req.session.userId) {
    res.redirect("/profil");
  } else {
    res.render("site/register", {
      navbarCategories: req.navbarCategories,
      webpageGeneral: req.webpageGeneral,
    });
  }
});

router.get("/profil",(req,res)=>{
  if(req.session.userId){
    User.findOne({_id:req.session.userId}).lean().then((user=>{
      res.render("site/profile",{user:user,navbarCategories: req.navbarCategories,
        webpageGeneral: req.webpageGeneral,})
    }))
  }else{
    res.redirect("/giris")
  }
});

router.post("/cikis",(req,res)=>{
  req.session.userId = null
  res.redirect("/")
})



router.put("/kullanici/hesapbilgi/:id",(req,res)=>{
  let userid = req.params.id
  User.findOne({_id:userid}).then((user)=>{
    Object.assign(user , req.body)
    user.save().then(user=>{
      res.redirect("/profil")
    })
  })
})

router.post("/kayitol/yenikayit", (req, res) => {
  User.create({ ...req.body }).then((user) => {
    ShoppingCart.create({userMail:user._id}).then(shoppingcart=>{
      res.redirect("/giris");
    })
  });
});
router.post("/girisyap", async (req, res) => {
  const { userMail, userPassword } = req.body;
  try {
    const user = await User.findOne({ userMail: userMail });

    if (user) {
      if (user.userPassword == userPassword) {
        req.session.userId = user._id;
        res.redirect("/profil");
      } else {
        res.redirect("/giris");
      }
    } else {
      res.redirect("/kayitol");
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Bir hata oluştu.");
  }
});

module.exports = router;
