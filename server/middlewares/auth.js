const jwt = require("jsonwebtoken");
require("dotenv").config();

/**
 * Middleware pro ověření JWT tokenu
 * Nejprve zkontrolujeme zda existuje platný token v hlavičce
 * Pokud je token platný, pokračujeme v provádění dalšího handleru. Pokud není, vracíme 401 (message: neplatný token)
 */
const verifyToken = (req, res, next) => {
  // Získání tokenu z hlavičky požadavku "authorization"
  const token = req.headers["authorization"];
  if (!token)
    return res
      .status(403)
      .json({ message: "A token is required for authentication" });

  try {
    // Rozdělení tokenu, protože v hlavičce je ve formátu "Bearer <token>", ale chceme jen tu druhou část
    const decoded = jwt.verify(token.split(" ")[1], process.env.TOKEN_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid token " });
  }
};

module.exports = verifyToken;
