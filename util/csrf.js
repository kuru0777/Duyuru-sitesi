const crypto = require("crypto");

// Deprecated 'csurf' paketinin yerine geçen, senkron-token tabanlı sade CSRF koruması.
// Token oturumda (session) tutulur; state değiştiren isteklerde form/gövdeden gelen
// token ile karşılaştırılır. Sabit zamanlı karşılaştırma ile timing sızıntısı önlenir.

const GUVENLI_METOTLAR = new Set(["GET", "HEAD", "OPTIONS"]);

function csrfKoruma(req, res, next) {
  if (!req.session) {
    return next(new Error("CSRF korumasi icin session gerekli."));
  }

  if (!req.session.csrfToken) {
    req.session.csrfToken = crypto.randomBytes(32).toString("hex");
  }

  // Şablonlarda <%= csrfToken %> olarak kullanılabilir.
  res.locals.csrfToken = req.session.csrfToken;

  if (GUVENLI_METOTLAR.has(req.method)) {
    return next();
  }

  const gonderilen =
    (req.body && req.body._csrf) ||
    req.headers["x-csrf-token"] ||
    req.headers["csrf-token"];

  const beklenen = req.session.csrfToken;
  const gecerli =
    typeof gonderilen === "string" &&
    gonderilen.length === beklenen.length &&
    crypto.timingSafeEqual(Buffer.from(gonderilen), Buffer.from(beklenen));

  if (!gecerli) {
    res.status(403);
    return next(new Error("Gecersiz CSRF token."));
  }

  next();
}

module.exports = csrfKoruma;
