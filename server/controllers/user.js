const User = require("../models/user");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const user = require("../models/user");

/**
 * Funkce pro přihlášení uživatele.
 * Zkontroluje zda je zadaný email a heslo, poté zkontroluje správnost emailu a hesla.
 * Pokud vše sedí, uživatel je přihlášen a je mu vygenerován JWT Token
 * Method: `POST`
 * URL : `http://localhost:3000/user/login`
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Zadejte e-mail a heslo." });
    }

    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res
        .status(401)
        .json({ message: "Špatně zadaný email nebo heslo." });
    }

    const token = jwt.sign({ userId: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    res.status(200).json({ user, token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce pro registraci nového uživatele.
 * Zkontroluje, zda jsou všechna pole správně vyplněna a zda uživatel s daným emailem již neexistuje.
 * Vytvoří nového uživatele a vygeneruje JWT token.
 * Method: `POST`
 * URL: `http://localhost:3000/user/register`
 */
exports.register = async (req, res) => {
  try {
    const { first_name, last_name, email, password } = req.body;
    if (!(first_name && last_name && email && password))
      return res.status(400).send({ message: "Všechna pole jsou povinná!" });

    const userExist = await User.findOne({ email });
    if (userExist)
      return res
        .status(400)
        .send({ message: "Tento email je již zaregistrován." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      first_name,
      last_name,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    const token = jwt.sign({ userId: user._id, email }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    res.status(201).json({ token, user: { first_name, last_name, email } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k získání informací specifického uživatele.
 * Method: `GET`
 * URL: `http://localhost:3000/user`
 */
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.userId).select("-password"); // Najdeme uživatele podle jeho `_id` a odebereme jeho heslo abychom ho neposlali na frontend.

    if (!user) {
      return res.status(404).json({ message: "Uživatel nenalezen" });
    }

    res.status(200).send({
      message: "User found",
      payload: user,
    });
  } catch (err) {
    res.status(500).json({ erorr: err.message });
  }
};

/**
 * Funkce k upravení informací specifického uživatele
 * Method: `PUT`
 * URL: `http://localhost:3000/user/:id`
 */
exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);
    if(!user) return res.status(404).json({ message: "User not found!"});

    // Při nahrávání nového souboru, smažeme starý uložený soubor (pokud nějaký existuje), abychom neměli složku /uploads přehlcenou zbytečnými nepoužívanými soubory
    if (req.files?.["profilePicture"]?.[0] && user.profilePicture) {
      const oldPath = path.join(__dirname, "../uploads", user.profilePicture);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }
    if (req.files?.["invoiceLogo"]?.[0] && user.invoiceLogo) {
      const oldPath = path.join(__dirname, "../uploads", user.invoiceLogo);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    /**
     * V případě že se odešle "null", smažeme obrázek.
     */
    let newInvoiceLogo;
    if (req.body.invoiceLogo === "null") {
      if (user.invoiceLogo) {
        const oldPath = path.join(__dirname, "../uploads", user.invoiceLogo);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      newInvoiceLogo = null;
    } else {
      newInvoiceLogo = req.files?.["invoiceLogo"]?.[0]?.filename || user.invoiceLogo;
    }
    
    let newProfilePicture;
    if (req.body.profilePicture === "null") {
      if (user.profilePicture) {
        const oldPath = path.join(__dirname, "../uploads", user.profilePicture);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      newProfilePicture = null;
    } else {
      newProfilePicture = req.files?.["profilePicture"]?.[0]?.filename || user.profilePicture;
    }

    const data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      profilePicture: newProfilePicture,
      detailsName: req.body.detailsName,
      ico: req.body.ico,
      hasIco: req.body.hasIco,
      street: req.body.street,
      city: req.body.city,
      zipCode: req.body.zipCode,
      phone: req.body.phone,
      website: req.body.website,
      dph: req.body.dph,
      dic: req.body.dic,
      accountNumber: req.body.accountNumber,
      iban: req.body.iban,
      swift: req.body.swift,
      invoiceLogo: newInvoiceLogo,
    };

    const result = await User.findByIdAndUpdate(req.params.id, data);
    if (result) {
      return res.status(200).send({
        message: "User updated",
        payload: result,
      });
    }
    res.status(400).send({
      message: "Wrong input!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k ověření správnosti hesla
 * Method: `POST`
 * URL: `http://localhost:3000/user/verifyPassword`
 */
exports.verifyPassword = async (req, res) => {
  try {
    const { password } = req.body;
    const user = await User.findById(req.user.userId);

    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Špatné heslo." });

    res.status(200).json({ message: "Heslo je správné." });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce ke smazání uživatele
 * Method: `DELETE`
 * URL: `http://localhost:3000/user/:id`
 */
exports.deleteUser = async (req, res) => {
  try {
    const data = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      profilePicture: req.body.profilePicture,
      detailsName: req.body.detailsName,
      ico: req.body.ico,
      hasIco: req.body.hasIco,
      street: req.body.street,
      city: req.body.city,
      zipCode: req.body.zipCode,
      phone: req.body.phone,
      website: req.body.website,
      dph: req.body.dph,
      dic: req.body.dic,
      invoiceLogo: req.body.invoiceLogo,
      signature: req.body.signature,
    };
    const result = await User.findByIdAndDelete(req.params.id, data);
    if (result) {
      return res.status(200).send({
        message: "User deleted",
        payload: result,
      });
    }
    res.status(400).send({
      message: "Wrong input!",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
