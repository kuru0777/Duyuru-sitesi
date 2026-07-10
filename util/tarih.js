// moment yerine, bağımlılık gerektirmeyen Intl tabanlı Türkçe tarih biçimlendirme.

const bicimlendirici = new Intl.DateTimeFormat("tr-TR", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

// Date | string | null -> "06 Temmuz 2026 14:30"
exports.bicimlendir = (deger) => {
  if (!deger) return "-";
  const tarih = deger instanceof Date ? deger : new Date(deger);
  if (Number.isNaN(tarih.getTime())) return "-";
  return bicimlendirici.format(tarih);
};

// <input type="datetime-local"> için "YYYY-MM-DDTHH:mm" biçimi
exports.inputIcin = (deger) => {
  if (!deger) return "";
  const tarih = deger instanceof Date ? deger : new Date(deger);
  if (Number.isNaN(tarih.getTime())) return "";
  const pad = (n) => String(n).padStart(2, "0");
  return (
    `${tarih.getFullYear()}-${pad(tarih.getMonth() + 1)}-${pad(tarih.getDate())}` +
    `T${pad(tarih.getHours())}:${pad(tarih.getMinutes())}`
  );
};
