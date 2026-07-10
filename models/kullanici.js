const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const kullaniciSchema = new Schema({
  ad: { type: String, required: true, trim: true },
  soyad: { type: String, required: true, trim: true },
  eposta: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  },
  sifre: { type: String, required: true },
  dogumTarihi: { type: Date, required: true },
  okulNumarasi: { type: String, required: true, trim: true },
  bolum: { type: String, required: true, trim: true },
});

module.exports = mongoose.model("Kullanici", kullaniciSchema);
