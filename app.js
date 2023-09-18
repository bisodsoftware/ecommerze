const path = require("path")
const express = require("express")
const exphbs = require("express-handlebars")
const app = express()
const bodyParser = require("body-parser")
const port = 3000
const hostname = "127.0.0.1"
const mongoose = require("mongoose")
const expressSession = require("express-session")
const MongoStore = require('connect-mongo'); 
const methodOverride = require("method-override")
const moment = require('moment');
const fileUpload = require("express-fileupload")
const helpers = require('handlebars-helpers');

mongoose.set('strictQuery', false);

mongoose.connect("mongodb+srv://alperentuna26:ormVStovLdVRQyUk@atuna.uqlxl3k.mongodb.net/bisodwebprojects", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})

app.use(fileUpload())


app.use(expressSession({
  secret: "testotesto",
  resave: false,
  saveUninitialized: true,
  store: MongoStore.create({
    mongoUrl: 'mongodb+srv://alperentuna26:ormVStovLdVRQyUk@atuna.uqlxl3k.mongodb.net/bisodwebprojects'
  })
}));
 
app.use(express.static("public"))
app.use(methodOverride('_method'))


const hbs = exphbs.create({
    
    helpers: {
        ifCond: function(v1, operator, v2, options) {
            switch (operator) {
              case '==':
                return v1 == v2 ? options.fn(this) : options.inverse(this);
              case '===':
                return v1 === v2 ? options.fn(this) : options.inverse(this);
              case '!=':
                return v1 != v2 ? options.fn(this) : options.inverse(this);
              case '!==':
                return v1 !== v2 ? options.fn(this) : options.inverse(this);
              case '<':
                return v1 < v2 ? options.fn(this) : options.inverse(this);
              case '<=':
                return v1 <= v2 ? options.fn(this) : options.inverse(this);
              case '>':
                return v1 > v2 ? options.fn(this) : options.inverse(this);
              case '>=':
                return v1 >= v2 ? options.fn(this) : options.inverse(this);
              default:
                return options.inverse(this);
            }
        },
        moment: function(date) {
            return moment(date).format("YYYY-MM-DD");
        },
        plus: function(a,b){
            return a+b;
        },
        subtraction: function(a,b){
            return a-b;
        },
        multiply: function(a,b){
            return  a*b;
        },
        divide: function(a,b){
            return  (a/b).toFixed(2).replace(/\.?0*$/, '');
        },
        moment: function(date) {
            return moment(date).format("YYYY-MM-DD");
        },
        less:function(a, b, options) {
            if (a < b) {
              return options.fn(this);
            }
        },
        '<': function (l, r) {
            return l < r;
        },
        eq: function (a, b) {
            return a === b;
        },
        eqIds: function (id1, id2) {
          return id1.equals(id2);
      },
    },
    defaultLayout:"main"
});

app.engine("handlebars", hbs.engine)
app.set("view engine", "handlebars")

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


// const users = require("./routes/users")
// const { group } = require("console")
// app.use("/users", users)



  

app.use((req, res, next) => {
    const main = require("./routes/main")
    app.use("/",main)
    const user = require("./routes/user")
    app.use("/",user)
    const admin = require("./routes/admin")
    app.use("/admin",admin)
    next();
})

app.listen(process.env.PORT || 3000);
//app.listen(port, () => console.log(`Example app listening ${hostname}:${port}`))