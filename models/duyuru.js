const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const duyuruSchema = new Schema(
  {
    duyuru_adi: { type: String, required: true, trim: true },
    gtarih: { type: Date, required: true }, // gösterime başlama tarihi
    btarih: { type: Date, required: true }, // gösterimden kalkma tarihi
    aciklama: { type: String, required: true, trim: true },
    icerik: { type: String, required: true, trim: true },
    resim_yol: { type: String, trim: true, default: "" },
    tiklanma: { type: Number, default: 0 },
    yazan: { type: Schema.Types.ObjectId, ref: "Kullanici", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Duyuru", duyuruSchema);
