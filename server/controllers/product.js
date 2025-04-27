const Product = require("../models/product");

/**
 * Funkce k získání všech produktů přihlášeného uživatele pomocí id
 * Method: `GET`
 * URL: `http://localhost:3000/product`
 */
exports.getAllUserProduct = async (req, res) => {
  try {
    const userId = req.user.userId;
    const products = await Product.find({ user_id: userId });

    if (!products)
      return res.status(404).json({ message: "Produkty nenalezeny" });

    res.status(200).send({
      message: "Products found!",
      payload: products,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k získání specifického produktu přihlášeného uživatele pomocí id
 * Method: `GET`
 * URL: `http://localhost:3000/product/:id`
 */
exports.getUserProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product)
      return res.status(404).json({ message: "Produkt nebyl nalezen" });
    if (product.user_id.toString() !== req.user.userId)
      return res.status(404).json({ message: "Produkt nebyl nalezen" });

    res.status(200).send({
      message: "Product found!",
      payload: product,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k vytvoření produktu
 * Method: `POST`
 * URL: `http://localhost:3000/product/`
 */
exports.createProduct = async (req, res) => {
  try {
    const data = new Product({
      user_id: req.body.user_id,
      amount: req.body.amount,
      unit: req.body.unit,
      productName: req.body.productName,
      price: req.body.price,
      dph: req.body.dph,
      dphType: req.body.dphType,
      discount: req.body.discount,
      discountType: req.body.discountType,
    });
    const result = await data.save();

    if (result) {
      return res.status(201).send({
        message: "Product created!",
        payload: result,
      });
    }

    res.status(400).send({ message: "Wrong input!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k upravení produktu
 * Method: `PUT`
 * URL: `http://localhost:3000/product/:id`
 */
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product.user_id.toString() !== req.user.userId)
      return res.status(404).send({ message: "Produkt nenalezen." });

    const data = {
      user_id: req.body.user_id,
      amount: req.body.amount,
      unit: req.body.unit,
      productName: req.body.productName,
      price: req.body.price,
      dph: req.body.dph,
      dphType: req.body.dphType,
      discount: req.body.discount,
      discountType: req.body.discountType,
    };

    const result = await Product.findByIdAndUpdate(req.params.id, data);
    if (result) {
      return res.status(200).send({
        message: "Product updated!",
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
 * Funkce ke smazání produktu
 * Method: `DELETE`
 * URL: `http://localhost:3000/product/:id`
 */
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product.user_id.toString() !== req.user.userId)
      return res.status(404).send({ message: "Produkt nenalezen." });

    const result = await Product.findByIdAndDelete(req.params.id);
    if (result) {
      return res.status(200).send({
        message: "Product deleted!",
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
