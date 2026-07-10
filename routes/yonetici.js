const express = require("express");
const router = express.Router();

const yetkiKontrol = require("../util/yetkiKontrol");
const duyuruController = require("../controllers/duyuru");

// Tüm yönetici işlemleri yetki kontrolünden geçer.
router.get("/duyuru-ekle", yetkiKontrol, duyuruController.getDuyuruEkle);
router.post("/duyuru-ekle", yetkiKontrol, duyuruController.postDuyuruEkle);

router.get("/duyuru-duzenle/:duyuruId", yetkiKontrol, duyuruController.getDuyuruDuzenle);
router.post("/duyuru-duzenle", yetkiKontrol, duyuruController.postDuyuruDuzenle);

module.exports = router;
