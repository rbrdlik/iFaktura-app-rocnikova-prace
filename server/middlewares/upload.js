const multer = require("multer");
const path = require("path");

/**
 * Konfigurace úložiště pro nahrávání souborů
 * Destination = Zde určujeme cílovou složku, kam se soubor uloží.
 * Filename = generujeme unikátní název souboru podle aktuálního času a náhodného čísla.
 */
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: (req, file, cb) => {
    const prefix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + prefix + ext);
  },
});

/**
 * Filtr pro povolené typy souborů.
 * Tato funkce filtruje soubor, povolené formáty jsou pouze JPEG, PNG a JPG. Jakékoliv jiné formáty filtr zamítne
 */
const filter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "image/jpg"];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(null, false);
};

/**
 * Middleware pro zpracování nahraného souboru
 */
const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Maximální velikost souboru 5MB
  filter,
});

module.exports = upload;
