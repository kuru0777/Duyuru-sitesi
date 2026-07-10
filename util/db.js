const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");

// Veritabanı bağlantısını çözer:
//   1) MONGODB_URI tanımlıysa ve erişilebiliyorsa ona bağlanır.
//   2) Erişilemezse (ya da URI yoksa) yerel geçici bir MongoDB başlatır
//      (mongodb-memory-server). Veriler ./.local-db klasöründe kalıcı tutulur,
//      böylece yeniden başlatmalarda kaybolmaz.
//
// Dönen `uri`, hem mongoose hem de session store'un aynı veritabanını
// kullanabilmesi için geri verilir.
async function baglan() {
  const { MONGODB_URI } = process.env;

  if (MONGODB_URI) {
    try {
      await mongoose.connect(MONGODB_URI, { serverSelectionTimeoutMS: 5000 });
      console.log("✓ Uzak MongoDB bağlantısı kuruldu.");
      return MONGODB_URI;
    } catch (err) {
      console.warn("✗ Uzak MongoDB'ye bağlanılamadı:", err.message);
      console.warn("→ Yerel geçici veritabanına geçiliyor (mongodb-memory-server)...");
    }
  } else {
    console.warn("MONGODB_URI tanımlı değil; yerel geçici veritabanı kullanılacak.");
  }

  let MongoMemoryServer;
  try {
    ({ MongoMemoryServer } = require("mongodb-memory-server"));
  } catch {
    throw new Error(
      "Yerel yedek için 'mongodb-memory-server' gerekli. Kurmak için: npm install -D mongodb-memory-server"
    );
  }

  const dbPath = path.join(__dirname, "..", ".local-db");
  fs.mkdirSync(dbPath, { recursive: true });

  // Önceki çalışma temiz kapanmadıysa (çökme / sert kapatma) bayat bir
  // mongod.lock kalır ve yeni mongod başlatılamaz. Başlatmadan ÖNCE bunu
  // temizliyoruz: dosya canlı bir mongod tarafından tutuluyorsa işletim sistemi
  // silmeye izin vermez (EBUSY) ve bunu anlaşılır bir hataya çeviririz.
  const lock = path.join(dbPath, "mongod.lock");
  if (fs.existsSync(lock)) {
    try {
      fs.rmSync(lock);
      console.warn("Bayat veritabanı kilidi (mongod.lock) temizlendi.");
    } catch {
      throw new Error(
        "Yerel veritabanı kilitli. Başka bir 'npm start' örneği çalışıyor olabilir; " +
          "onu kapatıp tekrar deneyin."
      );
    }
  }

  const mem = await MongoMemoryServer.create({
    instance: { dbPath, storageEngine: "wiredTiger" },
  });
  const uri = mem.getUri("iwebDB");
  await mongoose.connect(uri);

  console.log("✓ Yerel veritabanı hazır (veriler ./.local-db içinde saklanır).");

  // Süreç kapanırken yerel sunucuyu düzgün durdur.
  const kapat = async () => {
    await mongoose.connection.close().catch(() => {});
    await mem.stop().catch(() => {});
    process.exit(0);
  };
  process.on("SIGINT", kapat);
  process.on("SIGTERM", kapat);

  return uri;
}

module.exports = { baglan };
