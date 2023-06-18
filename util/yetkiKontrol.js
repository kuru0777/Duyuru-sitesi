module.exports = (req, res, next) => {
    if (!req.session.oturum_acildi || !req.session.kullanici) {
      return res.redirect('/giris');
    }
    req.kullanici = req.session.kullanici;
    next();
  };
  