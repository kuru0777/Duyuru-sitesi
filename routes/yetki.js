const express = require('express');
const path = require('path');

const router = express.Router();



const yetkiController=require('../controllers/yetki');

router.get('/giris', yetkiController.getGiris);

router.post('/giris', yetkiController.postGiris);

router.get('/cikis', yetkiController.getCikis);

router.get('/kayit', yetkiController.getKayit);

router.post('/kayit', yetkiController.postKayit);




module.exports = router;
