const express = require('express');
const path=require('path');

const router=express.Router();

const rootDir=require('../util/path');
const yoneticiVerisi = require('./yonetici');

const duyuruController=require('../controllers/duyuru');
const yetkiKontrol = require('../util/yetkiKontrol');

router.get('/', duyuruController.getDuyurular);
router.post('/duyuru-sil',yetkiKontrol, duyuruController.postSilId);
router.get('/duyuru-detay/:duyuruId', duyuruController.getDuyuru);
router.post('/artir-tiklanma/:duyuruId', yetkiKontrol,duyuruController.artirTiklanma);

router.post('/duyuru-duzenle/:duyuruId',yetkiKontrol,duyuruController.postDuyuruDuzenle);


module.exports=router;