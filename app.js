require("dotenv").config();

const path = require("path");
const crypto = require("crypto");
const express = require("express");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);

const { baglan } = require("./util/db");
const csrfKoruma = require("./util/csrf");
const hataController = require("./controllers/hata");

const yoneticiRoutes = require("./routes/yonetici");
const publicRoutes = require("./routes/public");
const yetkiRoutes = require("./routes/yetki");

const PORT = process.env.PORT || 3000;

let SESSION_SECRET = process.env.SESSION_SECRET;
if (!SESSION_SECRET) {
  SESSION_SECRET = crypto.randomBytes(32).toString("hex");
  console.warn(
    "SESSION_SECRET tanımlı değil; geçici bir anahtar üretildi (oturumlar yeniden başlatınca sıfırlanır)."
  );
}

async function baslat() {
  // Önce veritabanı bağlantısını çöz (uzak -> yerel yedek).
  const uri = await baglan();

  const app = express();

  app.set("view engine", "ejs");
  app.set("views", path.join(__dirname, "views"));

  const store = new MongoDBStore({ uri, collection: "sessions" });
  store.on("error", (err) => console.error("Session store hatası:", err));

  app.use(express.urlencoded({ extended: true }));
  app.use(express.static(path.join(__dirname, "public")));

  app.use(
    session({
      secret: SESSION_SECRET,
      resave: false,
      saveUninitialized: false,
      store: store,
      cookie: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 1000 * 60 * 60 * 8, // 8 saat
      },
    })
  );

  app.use(csrfKoruma);

  app.use((req, res, next) => {
    res.locals.yonetici = Boolean(req.session.oturum_acildi);
    next();
  });

  app.use(yoneticiRoutes);
  app.use(publicRoutes);
  app.use(yetkiRoutes);

  app.use(hataController.getHata404);

  // Merkezi hata yakalayıcı (CSRF hataları dahil).
  app.use((err, req, res, next) => {
    console.error(err.message);
    res.status(res.statusCode >= 400 ? res.statusCode : 500).render("hata", {
      sayfaBasligi: "Bir Hata Oluştu",
      mesaj:
        err.message === "Gecersiz CSRF token."
          ? "Oturum doğrulaması başarısız oldu. Lütfen sayfayı yenileyip tekrar deneyin."
          : "Beklenmeyen bir hata oluştu.",
    });
  });

  app.listen(PORT, () =>
    console.log(`Sunucu çalışıyor: http://localhost:${PORT}`)
  );
}

baslat().catch((err) => {
  console.error("Başlatma hatası:", err.message);
  process.exit(1);
});
