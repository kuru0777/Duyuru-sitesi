const express = require('express');
const path = require('path');

const router = express.Router();
const rootDir = require('../util/path');

const yetkiKontrol = require('../util/yetkiKontrol');


const duyuruController=require('../controllers/duyuru');

router.get('/duyuru-ekle', yetkiKontrol, duyuruController.getDuyuruEkle);
router.post('/duyuru-ekle',yetkiKontrol, duyuruController.postDuyuruEkle);

router.post('/duyuru-duzenle',yetkiKontrol, duyuruController.postDuyuruDuzenle);

exports.routes=router;
