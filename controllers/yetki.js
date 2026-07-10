const Kullanici = require("../models/kullanici");
const bcrypt = require("bcryptjs");

exports.getGiris = (req, res, next) => {
  res.render("giris", { sayfaBasligi: "Giriş Yap", yol: "/giris", hata: null });
};

exports.postGiris = (req, res, next) => {
  const eposta = (req.body.eposta || "").toLowerCase().trim();
  const sifre = req.body.sifre || "";

  Kullanici.findOne({ eposta })
    .then((kullanici) => {
      if (!kullanici) {
        return res.status(401).render("giris", {
          sayfaBasligi: "Giriş Yap",
          yol: "/giris",
          hata: "E-posta veya şifre hatalı.",
        });
      }

      return bcrypt.compare(sifre, kullanici.sifre).then((sifreDogru) => {
        if (!sifreDogru) {
          return res.status(401).render("giris", {
            sayfaBasligi: "Giriş Yap",
            yol: "/giris",
            hata: "E-posta veya şifre hatalı.",
          });
        }

        // Oturum sabitleme (session fixation) saldırılarına karşı oturumu yenile.
        req.session.regenerate((err) => {
          if (err) return next(err);
          req.session.oturum_acildi = true;
          req.session.kullanici = { _id: kullanici._id, ad: kullanici.ad };
          req.session.save(() => res.redirect("/"));
        });
      });
    })
    .catch(next);
};

exports.getCikis = (req, res, next) => {
  req.session.destroy((err) => {
    if (err) return next(err);
    res.clearCookie("connect.sid");
    res.redirect("/");
  });
};

exports.getKayit = (req, res, next) => {
  res.render("kayit", { sayfaBasligi: "Kayıt Ol", yol: "/kayit", hata: null });
};

exports.postKayit = (req, res, next) => {
  const eposta = (req.body.eposta || "").toLowerCase().trim();
  const { sifre, ad, soyad, bolum, dogumTarihi, okulNumarasi } = req.body;

  Kullanici.findOne({ eposta })
    .then((mevcut) => {
      if (mevcut) {
        return res.status(409).render("kayit", {
          sayfaBasligi: "Kayıt Ol",
          yol: "/kayit",
          hata: "Bu e-posta adresi zaten kayıtlı.",
        });
      }

      return bcrypt.hash(sifre, 12).then((hashedSifre) => {
        const kullanici = new Kullanici({
          eposta,
          sifre: hashedSifre,
          ad,
          soyad,
          bolum,
          dogumTarihi,
          okulNumarasi,
        });
        return kullanici.save().then(() => res.redirect("/giris"));
      });
    })
    .catch(next);
};
