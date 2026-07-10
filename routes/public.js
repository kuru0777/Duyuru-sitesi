const express = require("express");
const router = express.Router();

const duyuruController = require("../controllers/duyuru");
const yetkiKontrol = require("../util/yetkiKontrol");

router.get("/", duyuruController.getDuyurular);
router.get("/duyuru-detay/:duyuruId", duyuruController.getDuyuru);
router.post("/artir-tiklanma/:duyuruId", duyuruController.artirTiklanma);
router.post("/duyuru-sil", yetkiKontrol, duyuruController.postSilId);

module.exports = router;
