const Duyuru = require("../models/duyuru");
const moment = require('moment');
const Kullanici = require('../models/kullanici');

exports.getDuyurular = (req, res, next) => {
  const currentDate = moment().toDate(); 
  const currentFormattedDate = moment(currentDate).format('DD-MM-YYYY HH:mm'); 

  Duyuru.find({
    gtarih: { $lte: currentFormattedDate },
    btarih: { $gte: currentFormattedDate } 
  })
    .then((duyurular) => {
      res.render("index", {
        sayfaBasligi: "Duyuru Listesi",
        duyurular: duyurular,
        yol: "/"
      });
    })
    .catch((err) => {
      console.log(err);
    });
};





exports.getDuyuru = (req, res, next) => {
  const duyuruId = req.params.duyuruId;
 
  Duyuru.findById(duyuruId)
  .populate('yazan','ad soyad')
    .then((duyuru) => {
      res.render("duyuru-detay", {
        sayfaBasligi: "Duyuru Bilgisi",
        duyuru: duyuru,
        yol: "/"
       
      });
    })
    .catch((err) => {});
};

exports.getDuyuruEkle = (req, res, next) => {
  res.render("duyuru-ekle", {
    sayfaBasligi: "",
    baslikGoster: 2,
    yol: "/duyuru-ekle"
  
  });
};


exports.postDuyuruEkle = (req, res, next) => {
  const kullanici_id = req.body.kullanici_id;
  const duyuru_adi = req.body.duyuru_adi;
  const gtarih = moment(req.body.gtarih).locale('tr').format('DD-MM-YYYY HH:mm');
  const btarih = moment(req.body.btarih).locale('tr').format('DD-MM-YYYY HH:mm');
  const aciklama = req.body.aciklama;
  const icerik = req.body.icerik;
  const resim_yol = req.body.resim_yol;
  const tiklanma = 0;

  const duyuru = new Duyuru({
    duyuru_adi: duyuru_adi,
    gtarih: gtarih,
    btarih: btarih,
    aciklama: aciklama,
    icerik: icerik,
    resim_yol: resim_yol,
    tiklanma: tiklanma
  });

  Kullanici.findById(req.kullanici._id)
    .then((kullanici) => {
      duyuru.yazan = kullanici;
      return duyuru.save();
    })
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};



exports.getDuyuruDuzenle = (req, res, next) => {
  const duyuruId = req.params.duyuruId;

  Duyuru.findById(duyuruId)
    .then((duyuru) => {
      res.render("duyuru-duzenle", {
        sayfaBasligi: "Duyuru Düzenle",
        duyuru: duyuru,
        yol: "/"
      });
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};


exports.postDuyuruDuzenle = (req, res, next) => {
  const duyuruId = req.body.duyuruId;
  const updatedDuyuruAdi = req.body.duyuru_adi;
  const updatedGosterimTarihi = moment(req.body.gtarih).locale('tr').format('DD-MM-YYYY HH:mm');
  const updatedBitisTarihi = moment(req.body.btarih).locale('tr').format('DD-MM-YYYY HH:mm');
  const updatedAciklama = req.body.aciklama;
  const updatedIcerik = req.body.icerik;
  const updatedResimYol = req.body.resim_yol;

  Duyuru.findByIdAndUpdate(duyuruId, {
    duyuru_adi: updatedDuyuruAdi,
    gtarih: updatedGosterimTarihi,
    btarih: updatedBitisTarihi,
    aciklama: updatedAciklama,
    icerik: updatedIcerik,
    resim_yol: updatedResimYol
  })
    .then(() => {
      console.log('Duyuru güncellendi!');
      res.redirect('/');
    })
    .catch((err) => {
      console.log('Güncelleme başarısız: ', err);
      res.redirect('/');
    });
};




exports.postSilId = (req, res, next) => {
  const duyuruId = req.body.duyuruId;
  Duyuru.findByIdAndRemove(duyuruId)
    .then((result) => {
      console.log("Duyuru Silindi");
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.artirTiklanma = (req, res, next) => {
  const duyuruId = req.params.duyuruId;
 
  Duyuru.findById(duyuruId)
    .then((duyuru) => {
      duyuru.tiklanma += 1;
      return duyuru.save();
    })
    .then(() => {
      console.log('Duyurunun tiklanmasi artirildi.');
      res.redirect('/');
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getDuyuruById = (req, res, next) => {
  const duyuruId = req.params.duyuruId;
  Duyuru.findById(duyuruId)
    .then((duyuru) => {
      res.render('index', {
        duyuru: duyuru,
        csrfToken: req.csrfToken()
      });
    })
    .catch((err) => {
      console.log(err);
    });
};
