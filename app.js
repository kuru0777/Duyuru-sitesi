const http = require("http");
const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const rootDir = require("./util/path");
const session=require("express-session");
const MongoDBStore=require("connect-mongodb-session")(session);
const csurf=require('csurf');

const csurfKoruma=csurf();

const MONGODB_URI="mongodb+srv://mehmetkuru:mehmet0777@iweb.oypyr8c.mongodb.net/iwebDB?retryWrites=true&w=majority";


//const mongoConnect=require('./util/database').mongoConnect;
const mongoose = require("mongoose");

const app = express();

const store = new MongoDBStore({
  uri: MONGODB_URI,
  collection:'sessions'
  });

  

app.set("view engine", "ejs");
app.set("views", "views");

const hataController = require("./controllers/hata");

const yoneticiVerisi = require("./routes/yonetici");
const publicRoutes = require("./routes/public"); // .js kullanmıyoruz.
const yetkiRoutes = require("./routes/yetki"); // .js kullanmıyoruz.

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(rootDir, "public")));

app.use(session({secret:'gizli sifrem', resave:false, saveUnitialized:false, store:store}));



app.use(csurfKoruma);

app.use((req,res,next) => {
  res.locals.yonetici=req.session.oturum_acildi;
  res.locals.csrfToken=req.csrfToken();
  next();
})


app.use(yoneticiVerisi.routes);
app.use(publicRoutes);
app.use(yetkiRoutes);

app.use(hataController.getHata404);


mongoose
  .connect(MONGODB_URI)
  .then((result) => {
    app.listen(process.env.PORT || 3000);
  })
  .catch((err) => {
    console.log(err);
  });

