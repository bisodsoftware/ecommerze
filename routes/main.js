const express = require("express");
const router = express.Router();
const { text } = require("body-parser");
const Product = require("../models/Product.js");
const path = require("path");
const WebPage = require("../models/WebPage.js");
const Category = require("../models/Category.js");
const ShoppingCart = require("../models/ShoppingCart.js");
const User = require("../models/User.js");
const Order = require("../models/Order.js");
const Layout = require("../models/Layout.js");

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

router.get("/home", (req, res) => {
  res.render("home/index", { layout: "home" });
});

router.get("/", async (req, res) => {
  Layout.find({})
    .lean()
    .then((layouts) => {
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
                                              Product.find({
                                                sellingProd: true,
                                              })
                                                .lean()
                                                .then((sellingProd) => {
                                                  const cartItems =
                                                    req.shoppingcart
                                                      ? req.shoppingcart
                                                          .productName || []
                                                      : [];
                                                  const cartTotals =
                                                    calculateCartTotals(
                                                      cartItems
                                                    );
                                                  const data = {
                                                    cartItems,
                                                    cartTotals,
                                                    layouts:layouts,
                                                    trendingProd: trendingProd,
                                                    banner: banner,
                                                    dealOftheDay: dealOftheDay,
                                                    productGadget:
                                                      productGadget,
                                                    bannerProd: bannerProd,
                                                    discountProd: discountProd,
                                                    featuredProd: featuredProd,
                                                    sellingProd: sellingProd,
                                                    category: category,
                                                    product: product,
                                                    webpage: webpage,
                                                    shoppingcart:
                                                      req.shoppingcart,
                                                    webpageGeneral:
                                                      req.webpageGeneral,
                                                    navbarCategories:
                                                      req.navbarCategories,
                                                  };
                                                  if (
                                                    webpage.theme == "fashion"
                                                  ) {
                                                    res.render(
                                                      "foxicThemes/fashion/index",
                                                      {
                                                        layout: "fashion",
                                                        ...data,
                                                      }
                                                    );
                                                  } else if (
                                                    webpage.theme == "sport"
                                                  ) {
                                                    res.render("foxicThemes/sport/index", {
                                                      layout: "sport",
                                                      ...data,
                                                    });
                                                  } else if (
                                                    webpage.theme == "books"
                                                  ) {
                                                    res.render("foxicThemes/books/index", {
                                                      layout: "books",
                                                      ...data,
                                                    });
                                                  } else if (
                                                    webpage.theme == "cosmetics"
                                                  ) {
                                                    res.render(
                                                      "foxicThemes/cosmetics/index",
                                                      {
                                                        layout: "cosmetics",
                                                        ...data,
                                                      }
                                                    );
                                                  } else if (
                                                    webpage.theme ==
                                                    "electronics"
                                                  ) {
                                                    res.render(
                                                      "foxicThemes/electronics/index",
                                                      {
                                                        layout: "electronics",
                                                        ...data,
                                                      }
                                                    );
                                                  } else if (
                                                    webpage.theme ==
                                                    "foodmarket"
                                                  ) {
                                                    res.render(
                                                      "foxicThemes/foodmarket/index",
                                                      {
                                                        layout: "foodmarket",
                                                        ...data,
                                                      }
                                                    );
                                                  } else if (
                                                    webpage.theme == "games"
                                                  ) {
                                                    res.render("foxicThemes/games/index", {
                                                      layout: "games",
                                                      ...data,
                                                    });
                                                  } else if (
                                                    webpage.theme == "lingeries"
                                                  ) {
                                                    res.render(
                                                      "foxicThemes/lingeries/index",
                                                      {
                                                        layout: "lingeries",
                                                        ...data,
                                                      }
                                                    );
                                                  } else if (
                                                    webpage.theme == "pets"
                                                  ) {
                                                    res.render("foxicThemes/pets/index", {
                                                      layout: "pets",
                                                      ...data,
                                                    });
                                                  } else if (
                                                    webpage.theme == "site"
                                                  ) {
                                                    res.render(
                                                      "site/index",
                                                      data
                                                    );
                                                  } else {
                                                    res
                                                      .status(404)
                                                      .send(
                                                        "Tema Hatası. Lütfen site ayarlarınızdan temanızı güncelleyin. Hata devam ediyorsa yetkili ile iletişime geçin. bisod.com.tr."
                                                      );
                                                  }
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
    .populate({ path: "categoryName", model: Category })
    .lean()
    .then((product) => {
      const cartItems = req.shoppingcart
        ? req.shoppingcart.productName || []
        : [];
      const cartTotals = calculateCartTotals(cartItems);
      data = {
        cartItems,
        cartTotals,
        product: product,
        shoppingcart: req.shoppingcart,
        navbarCategories: req.navbarCategories,
        webpageGeneral: req.webpageGeneral,
      };
      if (req.webpageGeneral.theme == "fashion") {
        res.render("foxicThemes/common/product", { layout: "fashion", ...data });
      } else if (req.webpageGeneral.theme == "sport") {
        res.render("foxicThemes/common/product", { layout: "sport", ...data });
      } else if (req.webpageGeneral.theme == "books") {
        res.render("foxicThemes/common/product", { layout: "books", ...data });
      } else if (req.webpageGeneral.theme == "cosmetics") {
        res.render("foxicThemes/common/product", { layout: "cosmetics", ...data });
      } else if (req.webpageGeneral.theme == "electronics") {
        res.render("foxicThemes/common/product", { layout: "electronics", ...data });
      } else if (req.webpageGeneral.theme == "foodmarket") {
        res.render("foxicThemes/common/product", { layout: "foodmarket", ...data });
      } else if (req.webpageGeneral.theme == "games") {
        res.render("foxicThemes/common/product", { layout: "games", ...data });
      } else if (req.webpageGeneral.theme == "lingeries") {
        res.render("foxicThemes/common/product", { layout: "lingeries", ...data });
      } else if (req.webpageGeneral.theme == "pets") {
        res.render("foxicThemes/common/product", { layout: "pets", ...data });
      } else if (req.webpageGeneral.theme == "site") {
        res.render("site/category", data);
      } else {
        res
          .status(404)
          .send(
            "Tema Hatası. Lütfen site ayarlarınızdan temanızı güncelleyin. Hata devam ediyorsa yetkili ile iletişime geçin. bisod.com.tr."
          );
      }
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
          data = {
            cartItems,
            cartTotals,
            product: product,
            category: category,
            shoppingcart: req.shoppingcart,
            navbarCategories: req.navbarCategories,
            webpageGeneral: req.webpageGeneral,
          };

          if (req.webpageGeneral.theme == "fashion") {
            res.render("foxicThemes/common/category", { layout: "fashion", ...data });
          } else if (req.webpageGeneral.theme == "sport") {
            res.render("foxicThemes/common/category", { layout: "sport", ...data });
          } else if (req.webpageGeneral.theme == "books") {
            res.render("foxicThemes/common/category", { layout: "books", ...data });
          } else if (req.webpageGeneral.theme == "cosmetics") {
            res.render("foxicThemes/common/category", { layout: "cosmetics", ...data });
          } else if (req.webpageGeneral.theme == "electronics") {
            res.render("foxicThemes/common/category", { layout: "electronics", ...data });
          } else if (req.webpageGeneral.theme == "foodmarket") {
            res.render("foxicThemes/common/category", { layout: "foodmarket", ...data });
          } else if (req.webpageGeneral.theme == "games") {
            res.render("foxicThemes/common/category", { layout: "games", ...data });
          } else if (req.webpageGeneral.theme == "lingeries") {
            res.render("foxicThemes/common/category", { layout: "lingeries", ...data });
          } else if (req.webpageGeneral.theme == "pets") {
            res.render("foxicThemes/common/category", { layout: "pets", ...data });
          } else if (req.webpageGeneral.theme == "site") {
            res.render("site/category", data);
          } else {
            res
              .status(404)
              .send(
                "Tema Hatası. Lütfen site ayarlarınızdan temanızı güncelleyin. Hata devam ediyorsa yetkili ile iletişime geçin. bisod.com.tr."
              );
          }
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

router.delete("/urun/sil/:id", (req, res) => {
  console.log(req.shoppingcart.productName.indexOf(req.params.id));
  const products = req.shoppingcart.productName.indexOf(req.params.id);
  if (products > -1) {
    products.splice(products, 1);
  }
  res.redirect("/");
});

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

router.post("/odeme/onay", async (req, res) => {
  const cartItems = req.shoppingcart ? req.shoppingcart.productName || [] : [];
  const cartTotals = calculateCartTotals(cartItems);

  Order.create({
    ...req.body,
    productName: req.shoppingcart.productName,
    orderPrice: cartTotals.totalPrice + 20,
  }).then((order) => {
    req.shoppingcart.productName = [];
    res.render("site/order", {
      navbarCategories: req.navbarCategories,
      webpageGeneral: req.webpageGeneral,
      order: order,
    });
  });
});

module.exports = router;
