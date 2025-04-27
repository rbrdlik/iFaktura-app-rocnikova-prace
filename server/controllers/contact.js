const Contact = require("../models/contact");

/**
 * Funkce k získání všech kontaktů přihlášeného uživatele pomocí id
 * Method: `GET`
 * URL: `http://localhost:3000/contact`
 */
exports.getAllUserContact = async (req, res) => {
  try {
    const userId = req.user.userId;
    const contacts = await Contact.find({ user_id: userId });

    if (!contacts)
      return res.status(404).json({ message: "Kontakty nenalezeny" });

    res.status(200).send({
      message: "Contacts found!",
      payload: contacts,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k získání specifického kontaktu přihlášeného uživatele pomocí id
 * Method: `GET`
 * URL: `http://localhost:3000/contact/:id`
 */
exports.getUserContactById = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (!contact)
      return res.status(404).json({ message: "Kontakt nebyl nalezen" });
    if (contact.user_id.toString() !== req.user.userId)
      return res.status(404).json({ message: "Kontakt nebyl nalezen" });

    res.status(200).send({
      message: "Contact found!",
      payload: contact,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k vytvoření kontaktu
 * Method: `POST`
 * URL: `http://localhost:3000/contact/`
 */
exports.createContact = async (req, res) => {
  try {
    const data = new Contact({
      user_id: req.body.user_id,
      detailsName: req.body.detailsName,
      ico: req.body.ico,
      street: req.body.street,
      city: req.body.city,
      zipCode: req.body.zipCode,
      phone: req.body.phone,
      website: req.body.website,
      email: req.body.email,
      dic: req.body.dic,
    });
    const result = await data.save();

    if (result) {
      return res.status(201).send({
        message: "Contact created!",
        payload: result,
      });
    }

    res.status(400).send({ message: "Wrong input!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k upravení kontaktu
 * Method: `PUT`
 * URL: `http://localhost:3000/contact/:id`
 */
exports.updateContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact.user_id.toString() !== req.user.userId)
      return res.status(404).send({ message: "Kontakt nenalezen." });

    const data = {
      user_id: req.body.user_id,
      detailsName: req.body.detailsName,
      ico: req.body.ico,
      street: req.body.street,
      city: req.body.city,
      zipCode: req.body.zipCode,
      phone: req.body.phone,
      website: req.body.website,
      email: req.body.email,
      dic: req.body.dic,
    };

    const result = await Contact.findByIdAndUpdate(req.params.id, data);
    if (result) {
      return res.status(200).send({
        message: "Contact updated!",
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
 * Funkce ke smazání kontaktu
 * Method: `DELETE`
 * URL: `http://localhost:3000/contact/:id`
 */
exports.deleteContact = async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);

    if (contact.user_id.toString() !== req.user.userId)
      return res.status(404).send({ message: "Kontakt nenalezen." });

    const result = await Contact.findByIdAndDelete(req.params.id);
    if (result) {
      return res.status(200).send({
        message: "Contact deleted!",
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
