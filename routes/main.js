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
    totalQuantity+= product.quantity;
    totalPrice += product.productName.newPrice*product.quantity;
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
              .populate({ path: "items.productName", model: "Product" })
              .lean()
              .then((shoppingcart) => {
                req.shoppingcart = shoppingcart;
                req.webpageGeneral = webpageGeneral;
                req.navbarCategories = navbarCategories;
                next();
              });
          } else {
            ShoppingCart.findOne({ userId: req.session.id })
              .populate({ path: "items.productName", model: "Product" })
              .lean()
              .then((shoppingcart) => {
                req.shoppingcart = shoppingcart;
                req.webpageGeneral = webpageGeneral;
                req.navbarCategories = navbarCategories;
                next();
              });
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
                  const cartItems = req.shoppingcart ? req.shoppingcart.items || [] : [];
                  const cartTotals = calculateCartTotals(cartItems);
                  const data = {
                    cartItems,
                    cartTotals,
                    layouts: layouts,
                    category: category,
                    product: product,
                    webpage: webpage,
                    shoppingcart: req.shoppingcart,
                    webpageGeneral: req.webpageGeneral,
                    navbarCategories: req.navbarCategories,
                  };
                  if (webpage.theme == "fashion") {
                    res.render("foxicThemes/fashion/index", {
                      layout: "fashion",
                      ...data,
                    });
                  } else if (webpage.theme == "sport") {
                    res.render("foxicThemes/sport/index", {
                      layout: "sport",
                      ...data,
                    });
                  } else if (webpage.theme == "books") {
                    res.render("foxicThemes/books/index", {
                      layout: "books",
                      ...data,
                    });
                  } else if (webpage.theme == "cosmetics") {
                    res.render("foxicThemes/cosmetics/index", {
                      layout: "cosmetics",
                      ...data,
                    });
                  } else if (webpage.theme == "electronics") {
                    res.render("foxicThemes/electronics/index", {
                      layout: "electronics",
                      ...data,
                    });
                  } else if (webpage.theme == "foodmarket") {
                    res.render("foxicThemes/foodmarket/index", {
                      layout: "foodmarket",
                      ...data,
                    });
                  } else if (webpage.theme == "games") {
                    res.render("foxicThemes/games/index", {
                      layout: "games",
                      ...data,
                    });
                  } else if (webpage.theme == "lingeries") {
                    res.render("foxicThemes/lingeries/index", {
                      layout: "lingeries",
                      ...data,
                    });
                  } else if (webpage.theme == "pets") {
                    res.render("foxicThemes/pets/index", {
                      layout: "pets",
                      ...data,
                    });
                  } else if (webpage.theme == "site") {
                    res.render("site/index", data);
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
router.get("/urun/:id", (req, res) => {
  Product.findOne({ _id: req.params.id })
    .populate({ path: "categoryName", model: Category })
    .lean()
    .then((product) => {
      const cartItems = req.shoppingcart ? req.shoppingcart.items || [] : [];
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
        res.render("foxicThemes/common/product", {
          layout: "fashion",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "sport") {
        res.render("foxicThemes/common/product", { layout: "sport", ...data });
      } else if (req.webpageGeneral.theme == "books") {
        res.render("foxicThemes/common/product", { layout: "books", ...data });
      } else if (req.webpageGeneral.theme == "cosmetics") {
        res.render("foxicThemes/common/product", {
          layout: "cosmetics",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "electronics") {
        res.render("foxicThemes/common/product", {
          layout: "electronics",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "foodmarket") {
        res.render("foxicThemes/common/product", {
          layout: "foodmarket",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "games") {
        res.render("foxicThemes/common/product", { layout: "games", ...data });
      } else if (req.webpageGeneral.theme == "lingeries") {
        res.render("foxicThemes/common/product", {
          layout: "lingeries",
          ...data,
        });
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
            ? req.shoppingcart.items || []
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
            res.render("foxicThemes/common/category", {
              layout: "fashion",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "sport") {
            res.render("foxicThemes/common/category", {
              layout: "sport",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "books") {
            res.render("foxicThemes/common/category", {
              layout: "books",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "cosmetics") {
            res.render("foxicThemes/common/category", {
              layout: "cosmetics",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "electronics") {
            res.render("foxicThemes/common/category", {
              layout: "electronics",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "foodmarket") {
            res.render("foxicThemes/common/category", {
              layout: "foodmarket",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "games") {
            res.render("foxicThemes/common/category", {
              layout: "games",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "lingeries") {
            res.render("foxicThemes/common/category", {
              layout: "lingeries",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "pets") {
            res.render("foxicThemes/common/category", {
              layout: "pets",
              ...data,
            });
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
      const cartItems = req.shoppingcart ? req.shoppingcart.items || [] : [];
      const cartTotals = calculateCartTotals(cartItems);
      const data = {
        product: product,
        cartItems,
        cartTotals,
        shoppingcart: req.shoppingcart,
        navbarCategories: req.navbarCategories,
        webpageGeneral: req.webpageGeneral,
      }
      if (req.webpageGeneral.theme == "fashion") {
        res.render("foxicThemes/common/cart", {
          layout: "fashion",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "sport") {
        res.render("foxicThemes/common/cart", {
          layout: "sport",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "books") {
        res.render("foxicThemes/common/cart", {
          layout: "books",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "cosmetics") {
        res.render("foxicThemes/common/cart", {
          layout: "cosmetics",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "electronics") {
        res.render("foxicThemes/common/cart", {
          layout: "electronics",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "foodmarket") {
        res.render("foxicThemes/common/cart", {
          layout: "foodmarket",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "games") {
        res.render("foxicThemes/common/cart", {
          layout: "games",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "lingeries") {
        res.render("foxicThemes/common/cart", {
          layout: "lingeries",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "pets") {
        res.render("foxicThemes/common/cart", {
          layout: "pets",
          ...data,
        });
      } else if (req.webpageGeneral.theme == "site") {
        res.render("site/cart", data);
      } else {
        res
          .status(404)
          .send(
            "Tema Hatası. Lütfen site ayarlarınızdan temanızı güncelleyin. Hata devam ediyorsa yetkili ile iletişime geçin. bisod.com.tr."
          );
      }

    });
});

router.get("/odeme", async (req, res) => {
  const cartItems = req.shoppingcart ? req.shoppingcart.items || [] : [];
  const cartTotals = calculateCartTotals(cartItems);
  Product.find({})
    .lean()
    .then((product) => {
      User.findOne({ _id: req.session.userId })
        .lean()
        .then((user) => {
          const data ={
            user: user,
            product: product,
            cartItems,
            cartTotals,
            shoppingcart: req.shoppingcart,
            navbarCategories: req.navbarCategories,
            webpageGeneral: req.webpageGeneral,
          }
          if (req.webpageGeneral.theme == "fashion") {
            res.render("foxicThemes/common/checkout", {
              layout: "fashion",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "sport") {
            res.render("foxicThemes/common/checkout", {
              layout: "sport",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "books") {
            res.render("foxicThemes/common/checkout", {
              layout: "books",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "cosmetics") {
            res.render("foxicThemes/common/checkout", {
              layout: "cosmetics",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "electronics") {
            res.render("foxicThemes/common/checkout", {
              layout: "electronics",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "foodmarket") {
            res.render("foxicThemes/common/checkout", {
              layout: "foodmarket",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "games") {
            res.render("foxicThemes/common/checkout", {
              layout: "games",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "lingeries") {
            res.render("foxicThemes/common/checkout", {
              layout: "lingeries",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "pets") {
            res.render("foxicThemes/common/checkout", {
              layout: "pets",
              ...data,
            });
          } else if (req.webpageGeneral.theme == "site") {
            res.render("site/checkout", data);
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

router.delete("/urun/sil/:id", (req, res) => {
  console.log(req.shoppingcart.items.indexOf(req.params.id));
  const products = req.shoppingcart.items.indexOf(req.params.id);
  if (products > -1) {
    products.splice(products, 1);
  }
  res.redirect("/");
});

router.post("/yeniurun/urun/:id", async (req, res) => {
  let amount = 0;
  Number(req.body.quantity) ? amount = Number(req.body.quantity) : amount = 1;


  try {
    const user = await User.findOne({ _id: req.session.userId });
    if (user) {
      const shoppingcart = await ShoppingCart.findOne({ userMail: user._id });
      if (shoppingcart) {
        const matchedItem = shoppingcart.items.find((item)=>item.productName._id.toString() == req.params.id)
          if(matchedItem){
            matchedItem.quantity +=amount;
          }else{
            shoppingcart.items.push({
              productName: req.params.id,
              quantity: amount,
            });
          }
          shoppingcart.save();
      } else {
        res.status(500).send("Yetkili ile iletişime geçiniz.");
      }
    } else if (await ShoppingCart.findOne({ userId: req.session.id })) {
      ShoppingCart.findOne({ userId: req.session.id }).then(
        (shoppingcartGuest) => {
          const matchedItem= shoppingcartGuest.items.find((item)=>item.productName._id.toString() === req.params.id)
          if(matchedItem){
            matchedItem.quantity +=amount;
          }else{
            shoppingcartGuest.items.push({
              productName: req.params.id,
              quantity: amount,
            });
          }
          shoppingcartGuest.save();
        }
      );
    } else {
      ShoppingCart.create({ userId: req.session.id }).then(
        (shoppingcartnew) => {
          shoppingcartnew.items.push({
            productName: req.params.id,
            quantity: amount,
          });
          shoppingcartnew.save();
        }
      );
    }

    res.redirect("/");
  } catch (error) {
    console.error("Hata oluştu:", error);
    res.status(500).send("Bir hata oluştu.");
  }
});

router.post("/odeme/onay", async (req, res) => {
  const cart=req.shoppingcart;
  const cartItems = req.shoppingcart ? req.shoppingcart.items || [] : [];
  const cartTotals = calculateCartTotals(cartItems);
  Order.findOne().sort({date:-1}).then(orders=>{
    let orderNumber = 0;
    orders.orderNumber ? orderNumber = orders.orderNumber+1 : orderNumber=10000; 
    Order.create({
      ...req.body,
      orderNumber:orderNumber,
      orderStatus:"Siparişiniz Alındı",
      userMail: req.shoppingcart.userMail,
      items: req.shoppingcart.items,
      orderPrice: cartTotals.totalPrice + 20,
    }).then((order) => {
      ShoppingCart.findOne({_id: req.shoppingcart._id}).then(shoppingcart=>{
        shoppingcart.items=[]
        shoppingcart.save();
        res.redirect("/")
      })
  
    });
  })
  
  
});

router.post("/siparistekrar/:id",(req,res)=>{
  Order.findOne({_id:req.params.id}).then(order=>{
    ShoppingCart.findOne({_id: req.shoppingcart._id}).then(shoppingcart=>{
      shoppingcart.items=order.items
      shoppingcart.save();
      res.redirect("/sepet")
    })
  })
})

router.put("/order/delete/:id",(req,res)=>{
  console.log(req.shoppingcart.items.findOne({_id:req.params.id}))
  res.redirect("/sepet")
})

module.exports = router;
