const express = require("express");
const router = express.Router();
const { text } = require("body-parser");
const Product = require("../models/Product.js");
const path = require("path");
const WebPage = require("../models/WebPage.js");
const Category = require("../models/Category.js");
const ShoppingCart = require("../models/ShoppingCart.js");
const User = require("../models/User.js");
const Order = require("../models/Order.js")

function calculateCartTotals(cart) {
  let totalQuantity = 0;
  let totalPrice = 0;

  cart.forEach((product) => {
    totalQuantity++;
    totalPrice += product.newPrice;
  });

  return { totalQuantity, totalPrice };
}

async function loadNavbarCategories(req, res, next) {
  const user = await User.findOne({ _id: req.session.userId });
  Category.find({})
    .lean()
    .then((navbarCategories) => {
      WebPage.findOne({ _id: "64e8d2cce47f9664533fc798" })
        .lean()
        .then((webpageGeneral) => {
          if (user) {
            ShoppingCart.findOne({ userMail: user._id })
              .populate({ path: "productName", model: Product })
              .lean()
              .then((shoppingcart) => {
                req.shoppingcart = shoppingcart;
                req.webpageGeneral = webpageGeneral;
                req.navbarCategories = navbarCategories;
                next();
              });
          } else {
            req.webpageGeneral = webpageGeneral;
            req.navbarCategories = navbarCategories;
            next();
          }
        });
    })
    .catch((err) => {
      console.error(err);
      next(err);
    });
}

router.use(loadNavbarCategories);

router.get("/home",(req,res)=>{
  res.render("home/index",{layout:"home"})
})

router.get("/", async (req, res) => {
  Product.find({})
    .populate({ path: "categoryName", model: Category })
    .lean()
    .then((product) => {
      Category.find({ mainPage: true })
        .lean()
        .then((category) => {
          WebPage.findOne({ _id: "64e8d2cce47f9664533fc798" })
            .lean()
            .then((webpage) => {
              Product.find({ trendingProd: true })
                .populate({ path: "categoryName", model: Category })
                .lean()
                .then((trendingProd) => {
                  Product.findOne({ banner: true })
                    .populate({ path: "categoryName", model: Category })
                    .lean()
                    .then((banner) => {
                      Product.find({ dealOftheDay: true })
                        .lean()
                        .then((dealOftheDay) => {
                          Product.find({ productGadget: true })
                            .lean()
                            .then((productGadget) => {
                              Product.find({ bannerProd: true })
                                .lean()
                                .then((bannerProd) => {
                                  Product.find({ discountProd: true })
                                    .lean()
                                    .then((discountProd) => {
                                      Product.find({ featuredProd: true })
                                        .lean()
                                        .then((featuredProd) => {
                                          Product.find({ sellingProd: true })
                                            .lean()
                                            .then((sellingProd) => {
                                              const cartItems = req.shoppingcart
                                                ? req.shoppingcart
                                                    .productName || []
                                                : [];
                                              const cartTotals =
                                                calculateCartTotals(cartItems);
                                              res.render("site/index", {
                                                cartItems,
                                                cartTotals,
                                                trendingProd: trendingProd,
                                                banner: banner,
                                                dealOftheDay: dealOftheDay,
                                                productGadget: productGadget,
                                                bannerProd: bannerProd,
                                                discountProd: discountProd,
                                                featuredProd: featuredProd,
                                                sellingProd: sellingProd,
                                                category: category,
                                                product: product,
                                                webpage: webpage,
                                                shoppingcart: req.shoppingcart,
                                                webpageGeneral:
                                                  req.webpageGeneral,
                                                navbarCategories:
                                                  req.navbarCategories,
                                              });
                                            });
                                        });
                                    });
                                });
                            });
                        });
                    });
                });
            });
        });
    });
});

router.get("/urun/:id", (req, res) => {
  Product.findOne({ _id: req.params.id })
    .lean()
    .then((product) => {
      const cartItems = req.shoppingcart
        ? req.shoppingcart.productName || []
        : [];
      const cartTotals = calculateCartTotals(cartItems);
      res.render("site/productDetail", {
        cartItems,
        cartTotals,
        product: product,
        shoppingcart: req.shoppingcart,
        navbarCategories: req.navbarCategories,
        webpageGeneral: req.webpageGeneral,
      });
    });
});

router.get("/kategori/:id", (req, res) => {
  Product.find({ categoryName: req.params.id })
    .populate({ path: "categoryName", model: Category })
    .lean()
    .then((product) => {
      Category.findOne({ _id: req.params.id })
        .lean()
        .then((category) => {
          const cartItems = req.shoppingcart
            ? req.shoppingcart.productName || []
            : [];
          const cartTotals = calculateCartTotals(cartItems);
          res.render("site/category", {
            cartItems,
            cartTotals,
            product: product,
            category: category,
            shoppingcart: req.shoppingcart,
            navbarCategories: req.navbarCategories,
            webpageGeneral: req.webpageGeneral,
          });
        });
    });
});

router.get("/sepet", (req, res) => {
  Product.find({})
    .lean()
    .then((product) => {
      const cartItems = req.shoppingcart
        ? req.shoppingcart.productName || []
        : [];
      const cartTotals = calculateCartTotals(cartItems);
      res.render("site/cart", {
        product: product,
        cartItems,
        cartTotals,
        shoppingcart: req.shoppingcart,
        navbarCategories: req.navbarCategories,
        webpageGeneral: req.webpageGeneral,
      });
    });
});

router.get("/odeme", async (req, res) => {
  const cartItems = req.shoppingcart ? req.shoppingcart.productName || [] : [];
  const cartTotals = calculateCartTotals(cartItems);
  Product.find({})
    .lean()
    .then((product) => {
      User.findOne({ _id: req.session.userId })
        .lean()
        .then((user) => {
          res.render("site/checkout", {
            user: user,
            product: product,
            cartItems,
            cartTotals,
            shoppingcart: req.shoppingcart,
            navbarCategories: req.navbarCategories,
            webpageGeneral: req.webpageGeneral,
          });
        });
    });
});

router.delete("/urun/sil/:id",(req,res)=>{
  console.log(req.shoppingcart.productName.indexOf(req.params.id))
  const products=req.shoppingcart.productName.indexOf(req.params.id)
  if(products > -1){
    products.splice(products,1)
  }
  res.redirect("/")
})

router.post("/yeniurun/urun/:id", async (req, res) => {
  const user = await User.findOne({ _id: req.session.userId });
  ShoppingCart.findOne({ userMail: user._id }).then((shoppingcart) => {
    if (shoppingcart) {
      shoppingcart.productName.push(req.params.id);
      shoppingcart.save();
    } else {
      console.log("ShoppingCart bulunamadı veya null.");
    }
    res.redirect("/");
  });
});

router.post("/odeme/onay", async (req,res)=>{
  const cartItems = req.shoppingcart ? req.shoppingcart.productName || [] : [];
  const cartTotals = calculateCartTotals(cartItems);

  Order.create({...req.body, productName:req.shoppingcart.productName,orderPrice:cartTotals.totalPrice+20}).then(order=>{
    req.shoppingcart.productName=[];
    res.render("site/order",{navbarCategories: req.navbarCategories,webpageGeneral: req.webpageGeneral,order:order,})
  })
})

module.exports = router;
