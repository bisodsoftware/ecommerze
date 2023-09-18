const express = require("express")
const router = express.Router()
const Product = require("../models/Product.js")
const path = require("path")
const { text } = require("body-parser")
const WebPage = require("../models/WebPage.js")
const Category = require("../models/Category")
const User = require("../models/User.js")
const Order = require("../models/Order.js")
const Layout = require("../models/Layout.js")
const { appendFile } = require("fs")



router.get('/', (req, res) => {
   res.render('panel/index',{layout:"admin"}); // will use admin layout
});

router.get("/siparisler",(req,res)=>{
  Order.find({}).populate({ path: "productName", model: Product }).populate({ path: "userMail", model: User }).lean().then(order=>{
    res.render("panel/orders",{order:order,layout:"admin"})

  })
})
router.get("/urunekle",(req,res)=>{
  Category.find().lean().then(category=>{
    res.render("panel/addProduct",{category:category,layout:"admin"})
  })
})

router.get("/urunler",(req,res)=>{
  Product.find().lean().then(product =>{
    res.render("panel/products",{product:product,layout:"admin"})
  })
})
router.get("/kategoriler",(req,res)=>{
  Category.find().lean().then(category =>{
    res.render("panel/addCategory",{category:category,layout:"admin"})
  })
})

router.get("/anasayfa-ayarlar",(req,res)=>{
  WebPage.findOne({_id:"64e8d2cce47f9664533fc798"}).lean().then(webpage=>{
    res.render("panel/mainPageSettings",{webpage:webpage,layout:"admin"})
  })
})

router.get("/layout-ayarlar",(req,res)=>{
  WebPage.findOne({_id:"64e8d2cce47f9664533fc798"}).lean().then(webpage=>{
    Category.find({}).lean().then(category=>{
      res.render("panel/layoutSettings",{webpage:webpage,category:category,layout:"admin"})

    })
  })
})

router.get("/site-bilgiler",(req,res)=>{
  WebPage.findOne({_id:"64e8d2cce47f9664533fc798"}).lean().then(webpage=>{
    res.render("panel/websiteInformation",{webpage:webpage,layout:"admin"})
  })
})



router.put("/websiteInfo/64e8d2cce47f9664533fc798",(req,res) =>{

  WebPage.findOne({_id:"64e8d2cce47f9664533fc798"}).then(webpage=>{
    if(req.files && req.files.webIcon && req.files.webIco){
      let webIconImage = req.files.webIcon
      let webIcoImage = req.files.webIco
      webIconImage.mv(path.resolve(__dirname, '../public/img/websiteInfo',webIconImage.name))
      webIcoImage.mv(path.resolve(__dirname, '../public/img/websiteInfo',webIcoImage.name))
      Object.assign(webpage, {...req.body,webIcon:`/img/websiteInfo/${webIconImage.name}`,webIco:`/img/websiteInfo/${webIcoImage.name}`},);
     
    }
    else if (req.files && req.files.webIcon){
      let webIconImage = req.files.webIcon
      webIconImage.mv(path.resolve(__dirname, '../public/img/websiteInfo',webIconImage.name))
      Object.assign(webpage, {...req.body,webIcon:`/img/websiteInfo/${webIconImage.name}`},);
    }
    else if(req.files && req.files.webIco){
      let webIcoImage = req.files.webIco
      webIcoImage.mv(path.resolve(__dirname, '../public/img/websiteInfo',webIcoImage.name))
      Object.assign(webpage, {...req.body,webIco:`/img/websiteInfo/${webIcoImage.name}`},);
    }
    else{
      Object.assign(webpage, req.body);
    }
    webpage.save().then(webpage=>{
      res.redirect("/admin/site-bilgiler")
    })
  })
})

router.put("/imageChange/64e8d2cce47f9664533fc798",(req,res) =>{
  WebPage.findOne({_id:"64e8d2cce47f9664533fc798"}).then(webpage=>{
    let webMainPageAddFirstImage = req.files.webMainPageAddFirstImage
    webMainPageAddFirstImage.mv(path.resolve(__dirname, '../public/img/websiteInfo',webMainPageAddFirstImage.name))
    let webMainPageAddSecondImage = req.files.webMainPageAddSecondImage
    webMainPageAddSecondImage.mv(path.resolve(__dirname, '../public/img/websiteInfo',webMainPageAddSecondImage.name))
    let webMainPageAddThirdImage = req.files.webMainPageAddThirdImage
    webMainPageAddThirdImage.mv(path.resolve(__dirname, '../public/img/websiteInfo',webMainPageAddThirdImage.name))
    Object.assign(webpage, {...req.body,webMainPageAddThirdImage:`/img/websiteInfo/${webMainPageAddThirdImage.name}`,webMainPageAddFirstImage:`/img/websiteInfo/${webMainPageAddFirstImage.name}`,webMainPageAddSecondImage:`/img/websiteInfo/${webMainPageAddSecondImage.name}`},);
    webpage.save().then(webpage=>{
      res.redirect("/admin/site-bilgiler")
    })
  })
})

router.post("/newCategory",(req,res)=>{
  let image = req.files.image
  image.mv(path.resolve(__dirname, '../public/img/categoryimages',image.name))
  Category.create({...req.body, mainPage:req.body.mainPage === "on", image:`/img/categoryimages/${image.name}`}).then(category =>{
      res.redirect("/admin/kategoriler")
  })
})


router.post("/newLayout",(req,res)=>{
  Layout.create({...req.body}).then(layout=>{
    res.redirect("/admin/layout-ayarlar")
  })
})


router.post("/yeniUrun",(req,res) =>{
    let images = req.files.image; // "image" alanı birden fazla dosya seçilmesine izin verecek şekilde isimlendirilmelidir
    if (!Array.isArray(images)) {
      images = [images];
    }
  
    const imagePromises = images.map((image) =>
      image.mv(
        path.resolve(__dirname, "../public/img/productimages/", image.name)
      )
    );
  
    Promise.all(imagePromises)
      .then(() => {
        const productData = {
          ...req.body,
          trendingProd:req.body.trendingProd === "on",
          banner:req.body.banner === "on",
          dealOftheDay:req.body.dealOftheDay === "on",
          productGadget:req.body.productGadget === "on",
          bannerProd:req.body.bannerProd === "on",
          discountProd:req.body.discountProd === "on",
          featuredProd:req.body.featuredProd === "on",
          sellingProd:req.body.sellingProd === "on",
          image: images.map((image) => `/img/productimages/${image.name}`),
        };
        Product.create(productData).then((product) => {
          res.redirect("/admin");
        });
      })
      .catch((error) => {
        // Hata işleme
        console.error(error);
        res.status(500).send("Dosya yüklenirken bir hata oluştu.");
      });
})

module.exports = router