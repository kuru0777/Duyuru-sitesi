const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const kullaniciSchema = new Schema({
  ad: {
    type: String,
    required: true,
  },
  soyad: {
    type: String,
    required: true,
  },
  eposta: {
    type: String,
    required: true,
  },
  sifre: {
    type: String,
    required: true,
  },
  dogumTarihi: {
    type: Date,
    required: true,
  },
  okulNumarasi: {
    type: String,
    required: true,
  },
  bolum: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Kullanici', kullaniciSchema);
