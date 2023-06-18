const mongoose = require('mongoose');

const Schema=mongoose.Schema;

const duyuruSchema = new Schema({
  duyuru_adi: {
    type: String,
    required: true,
  },
  gtarih: {
    type: String,
    required: true,
  },
  btarih: {
    type: String,
    required: true,
  },
  aciklama: {
    type: String,
    required: true,
  },
  icerik: {
    type: String,
    required: true,
  },
  resim_yol: {
    type: String,
    required: true,
  },
  tiklanma: {
    type: Number,
    required: true,
  },
  yazan: {
    type: Schema.Types.ObjectId,
    ref: 'Kullanici',
    required: true,
  },
});

module.exports=mongoose.model('Duyuru', duyuruSchema);
