const express = require("express");
const router = express.Router();
const { text } = require("body-parser");
const User = require("../models/User.js");
const Category = require("../models/Category.js");
const WebPage = require("../models/WebPage.js");
const ShoppingCart = require("../models/ShoppingCart.js")

const path = require("path");
const Order = require("../models/Order.js");

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
    const data = {
      navbarCategories: req.navbarCategories,
      webpageGeneral: req.webpageGeneral,
    }
    if (req.webpageGeneral.theme == "fashion") {
        res.render("foxicThemes/common/login", { layout: "fashion", ...data });
      } else if (req.webpageGeneral.theme == "sport") {
        res.render("foxicThemes/common/login", { layout: "sport", ...data });
      } else if (req.webpageGeneral.theme == "books") {
        res.render("foxicThemes/common/login", { layout: "books", ...data });
      } else if (req.webpageGeneral.theme == "cosmetics") {
        res.render("foxicThemes/common/login", { layout: "cosmetics", ...data });
      } else if (req.webpageGeneral.theme == "electronics") {
        res.render("foxicThemes/common/login", { layout: "electronics", ...data });
      } else if (req.webpageGeneral.theme == "foodmarket") {
        res.render("foxicThemes/common/login", { layout: "foodmarket", ...data });
      } else if (req.webpageGeneral.theme == "games") {
        res.render("foxicThemes/common/login", { layout: "games", ...data });
      } else if (req.webpageGeneral.theme == "lingeries") {
        res.render("foxicThemes/common/login", { layout: "lingeries", ...data });
      } else if (req.webpageGeneral.theme == "pets") {
        res.render("foxicThemes/common/login", { layout: "pets", ...data });
      } else if (req.webpageGeneral.theme == "site") {
        res.render("site/login", data);
      } else {
        res
          .status(404)
          .send(
            "Tema Hatası. Lütfen site ayarlarınızdan temanızı güncelleyin. Hata devam ediyorsa yetkili ile iletişime geçin. bisod.com.tr."
          );
      }
  }
});


router.get("/kayitol", (req, res) => {
  if (req.session.userId) {
    res.redirect("/profil");
  } else {
    const data = {
      navbarCategories: req.navbarCategories,
      webpageGeneral: req.webpageGeneral,
    }
    if (req.webpageGeneral.theme == "fashion") {
        res.render("foxicThemes/common/register", { layout: "fashion", ...data });
      } else if (req.webpageGeneral.theme == "sport") {
        res.render("foxicThemes/common/register", { layout: "sport", ...data });
      } else if (req.webpageGeneral.theme == "books") {
        res.render("foxicThemes/common/register", { layout: "books", ...data });
      } else if (req.webpageGeneral.theme == "cosmetics") {
        res.render("foxicThemes/common/register", { layout: "cosmetics", ...data });
      } else if (req.webpageGeneral.theme == "electronics") {
        res.render("foxicThemes/common/register", { layout: "electronics", ...data });
      } else if (req.webpageGeneral.theme == "foodmarket") {
        res.render("foxicThemes/common/register", { layout: "foodmarket", ...data });
      } else if (req.webpageGeneral.theme == "games") {
        res.render("foxicThemes/common/register", { layout: "games", ...data });
      } else if (req.webpageGeneral.theme == "lingeries") {
        res.render("foxicThemes/common/register", { layout: "lingeries", ...data });
      } else if (req.webpageGeneral.theme == "pets") {
        res.render("foxicThemes/common/register", { layout: "pets", ...data });
      } else if (req.webpageGeneral.theme == "site") {
        res.render("site/category", data);
      } else {
        res
          .status(404)
          .send(
            "Tema Hatası. Lütfen site ayarlarınızdan temanızı güncelleyin. Hata devam ediyorsa yetkili ile iletişime geçin. bisod.com.tr."
          );
      }
  }
});

router.get("/profil",(req,res)=>{
  if(req.session.userId){
    User.findOne({_id:req.session.userId}).lean().then((user=>{
      const data = {
        user:user,navbarCategories: req.navbarCategories,
          webpageGeneral: req.webpageGeneral
      }
      if (req.webpageGeneral.theme == "fashion") {
        res.render("foxicThemes/common/account-details", { layout: "fashion", ...data });
      } else if (req.webpageGeneral.theme == "sport") {
        res.render("foxicThemes/common/account-details", { layout: "sport", ...data });
      } else if (req.webpageGeneral.theme == "books") {
        res.render("foxicThemes/common/account-details", { layout: "books", ...data });
      } else if (req.webpageGeneral.theme == "cosmetics") {
        res.render("foxicThemes/common/account-details", { layout: "cosmetics", ...data });
      } else if (req.webpageGeneral.theme == "electronics") {
        res.render("foxicThemes/common/account-details", { layout: "electronics", ...data });
      } else if (req.webpageGeneral.theme == "foodmarket") {
        res.render("foxicThemes/common/account-details", { layout: "foodmarket", ...data });
      } else if (req.webpageGeneral.theme == "games") {
        res.render("foxicThemes/common/account-details", { layout: "games", ...data });
      } else if (req.webpageGeneral.theme == "lingeries") {
        res.render("foxicThemes/common/account-details", { layout: "lingeries", ...data });
      } else if (req.webpageGeneral.theme == "pets") {
        res.render("foxicThemes/common/account-details", { layout: "pets", ...data });
      } else if (req.webpageGeneral.theme == "site") {
        res.render("site/category", data);
      } else {
        res
          .status(404)
          .send(
            "Tema Hatası. Lütfen site ayarlarınızdan temanızı güncelleyin. Hata devam ediyorsa yetkili ile iletişime geçin. bisod.com.tr."
          );
      }
    }))
  }else{
    res.redirect("/giris")
  }
});


router.get("/profil/siparislerim",(req,res)=>{
  if(req.session.userId){
    User.findOne({_id:req.session.userId}).lean().then((user=>{
      Order.find({userMail:user._id}).populate({ path: "items.productName", model: "Product" }).lean().then(order=>{
        const data = {
          user:user,navbarCategories: req.navbarCategories,
            webpageGeneral: req.webpageGeneral,order:order,
        }
     
      if (req.webpageGeneral.theme == "fashion") {
        res.render("foxicThemes/common/orderHistory", { layout: "fashion", ...data });
      } else if (req.webpageGeneral.theme == "sport") {
        res.render("foxicThemes/common/orderHistory", { layout: "sport", ...data });
      } else if (req.webpageGeneral.theme == "books") {
        res.render("foxicThemes/common/orderHistory", { layout: "books", ...data });
      } else if (req.webpageGeneral.theme == "cosmetics") {
        res.render("foxicThemes/common/orderHistory", { layout: "cosmetics", ...data });
      } else if (req.webpageGeneral.theme == "electronics") {
        res.render("foxicThemes/common/orderHistory", { layout: "electronics", ...data });
      } else if (req.webpageGeneral.theme == "foodmarket") {
        res.render("foxicThemes/common/orderHistory", { layout: "foodmarket", ...data });
      } else if (req.webpageGeneral.theme == "games") {
        res.render("foxicThemes/common/orderHistory", { layout: "games", ...data });
      } else if (req.webpageGeneral.theme == "lingeries") {
        res.render("foxicThemes/common/orderHistory", { layout: "lingeries", ...data });
      } else if (req.webpageGeneral.theme == "pets") {
        res.render("foxicThemes/common/orderHistory", { layout: "pets", ...data });
      } else if (req.webpageGeneral.theme == "site") {
        res.render("site/category", data);
      } else {
        res
          .status(404)
          .send(
            "Tema Hatası. Lütfen site ayarlarınızdan temanızı güncelleyin. Hata devam ediyorsa yetkili ile iletişime geçin. bisod.com.tr."
          );
      }
    })
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
    console.log(userMail)
    console.log(userPassword)

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
