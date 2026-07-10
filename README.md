# Duyuru Sitesi — MAKÜ Bucak Teknoloji Fakültesi

Burdur Mehmet Akif Ersoy Üniversitesi İleri Web dersi için geliştirilen duyuru
sitesi. Node.js + Express + MongoDB (Mongoose) + EJS ile yazılmıştır.

## Özellikler
- Yayın/bitiş tarihine göre otomatik filtrelenen duyuru listesi
- Yönetici kaydı ve girişi (bcrypt ile şifre hashleme)
- Duyuru ekleme / düzenleme / silme (yetki + CSRF korumalı)
- Açık/koyu tema destekli, tamamen özgün tasarım sistemi (teal + slate)

## Kurulum
```bash
npm install
cp .env.example .env   # opsiyonel; doldurmadan da çalışır
npm start              # veya geliştirme için: npm run dev
```
Uygulama varsayılan olarak `http://localhost:3000` adresinde çalışır.

**Veritabanı gerektirmez.** `MONGODB_URI` boş bırakılırsa uygulama ilk çalıştırmada
otomatik olarak yerel bir MongoDB başlatır (`mongodb-memory-server`) ve verileri
`./.local-db` klasöründe kalıcı olarak saklar. Yani depoyu klonlayıp `npm install`
+ `npm start` demek yeterlidir; kayıtlar, duyurular hepsi yerelde tutulur.

> İlk çalıştırmada `mongodb-memory-server` bir kez `mongod` ikili dosyasını indirir
> (internet gerekir). Sonraki çalıştırmalar çevrimdışı da çalışır.

Kendi MongoDB / Atlas kümenizi kullanmak isterseniz `.env` içine `MONGODB_URI`
yazmanız yeterli — uygulama önce ona bağlanmayı dener, erişilemezse yerel
veritabanına düşer.

## Ortam Değişkenleri (.env)
| Değişken | Açıklama |
| --- | --- |
| `MONGODB_URI` | Opsiyonel. Boşsa yerel veritabanı kullanılır; doluysa o adrese bağlanır |
| `SESSION_SECRET` | Oturum imzalama anahtarı (uzun, rastgele). Boşsa geçici üretilir |
| `PORT` | Sunucu portu (varsayılan 3000) |

> Güvenlik: Gizli bilgiler `.env` dosyasında tutulur ve `.gitignore` ile depoya
> girmez; depoda gerçek bağlantı bilgisi bulunmaz. Bu projeyi daha önce gerçek
> parolayla commit'lediyseniz o parola **git geçmişinde** kalmış olabilir —
> sızmış kabul edip değiştirin.

## Dizin Yapısı
```
app.js              Uygulama girişi, middleware ve rota kurulumu
controllers/        İş mantığı (duyuru, yetki, hata)
models/             Mongoose şemaları (Duyuru, Kullanici)
routes/             Rota tanımları (public, yetki, yonetici)
util/               CSRF middleware, tarih yardımcısı, yetki kontrolü
views/              EJS şablonları + ortak parçalar (includes)
public/css/app.css  Tasarım sistemi (tek dosya, harici bağımlılık yok)
```
