const Duyuru = require("../models/duyuru");
const tarih = require("../util/tarih");

// Ana liste: sadece yayın aralığında (gtarih <= şimdi <= btarih) olan duyurular.
exports.getDuyurular = (req, res, next) => {
  const simdi = new Date();

  Duyuru.find({ gtarih: { $lte: simdi }, btarih: { $gte: simdi } })
    .sort({ createdAt: -1 })
    .then((duyurular) => {
      res.render("index", {
        sayfaBasligi: "Duyurular",
        duyurular: duyurular,
        yol: "/",
        tarih: tarih,
      });
    })
    .catch(next);
};

exports.getDuyuru = (req, res, next) => {
  Duyuru.findById(req.params.duyuruId)
    .populate("yazan", "ad soyad")
    .then((duyuru) => {
      if (!duyuru) {
        res.status(404);
        return next();
      }
      res.render("duyuru-detay", {
        sayfaBasligi: duyuru.duyuru_adi,
        duyuru: duyuru,
        yol: "/",
        tarih: tarih,
      });
    })
    .catch(next);
};

exports.getDuyuruEkle = (req, res, next) => {
  res.render("duyuru-form", {
    sayfaBasligi: "Duyuru Ekle",
    yol: "/duyuru-ekle",
    duzenleme: false,
    duyuru: null,
    tarih: tarih,
  });
};

exports.postDuyuruEkle = (req, res, next) => {
  const { duyuru_adi, gtarih, btarih, aciklama, icerik, resim_yol } = req.body;

  const duyuru = new Duyuru({
    duyuru_adi,
    gtarih: new Date(gtarih),
    btarih: new Date(btarih),
    aciklama,
    icerik,
    resim_yol,
    yazan: req.kullanici._id,
  });

  duyuru
    .save()
    .then(() => res.redirect("/"))
    .catch(next);
};

exports.getDuyuruDuzenle = (req, res, next) => {
  Duyuru.findById(req.params.duyuruId)
    .then((duyuru) => {
      if (!duyuru) {
        res.status(404);
        return next();
      }
      res.render("duyuru-form", {
        sayfaBasligi: "Duyuru Düzenle",
        yol: "/",
        duzenleme: true,
        duyuru: duyuru,
        tarih: tarih,
      });
    })
    .catch(next);
};

exports.postDuyuruDuzenle = (req, res, next) => {
  const { duyuruId, duyuru_adi, gtarih, btarih, aciklama, icerik, resim_yol } =
    req.body;

  Duyuru.findByIdAndUpdate(duyuruId, {
    duyuru_adi,
    gtarih: new Date(gtarih),
    btarih: new Date(btarih),
    aciklama,
    icerik,
    resim_yol,
  })
    .then(() => res.redirect("/"))
    .catch(next);
};

exports.postSilId = (req, res, next) => {
  Duyuru.findByIdAndDelete(req.body.duyuruId)
    .then(() => res.redirect("/"))
    .catch(next);
};

exports.artirTiklanma = (req, res, next) => {
  Duyuru.findByIdAndUpdate(req.params.duyuruId, { $inc: { tiklanma: 1 } })
    .then(() => res.redirect("/duyuru-detay/" + req.params.duyuruId))
    .catch(next);
};
