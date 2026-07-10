exports.getHata404 = (req, res, next) => {
  res.status(404).render("sayfa404", {
    sayfaBasligi: "Sayfa Bulunamadı",
    yol: "",
  });
};
