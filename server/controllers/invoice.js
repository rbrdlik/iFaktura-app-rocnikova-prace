const Invoice = require("../models/invoice");

/**
 * Funkce k získání všech faktur přihlášeného uživatele pomocí id
 * Method: `GET`
 * URL: `http://localhost:3000/invoice`
 */
exports.getAllUserInvoice = async (req, res) => {
  try {
    const userId = req.user.userId;
    const invoices = await Invoice.find({ user_id: userId });

    if (!invoices)
      return res.status(404).json({ message: "Faktury nenalezeny" });

    res.status(200).send({
      message: "Invoices found!",
      payload: invoices,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k získání všech uhrazených, neuhrazených faktur, a faktur po splatnosti
 * Method: `GET`
 * URL: `http://localhost:3000/invoice/stats/:period`
 */
exports.getAllUserInvoiceStats = async (req, res) => {
  try {
    const userId = req.user.userId;
    const period = req.params.period;

    let startDate;
    let endDate;

    if (period === "month") {
      startDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), 1));
      endDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() + 1, 0, 23, 59, 59, 999));
    } else if (period === "quarter") {
      startDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth() - 2, 1)); 
      endDate = new Date(Date.UTC(new Date().getFullYear(), new Date().getMonth(), new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate(), 23, 59, 59, 999));
    } else if (period === "year") {
      startDate = new Date(Date.UTC(new Date().getFullYear(), 0, 1));
      endDate = new Date(Date.UTC(new Date().getFullYear(), 11, 31, 23, 59, 59, 999));
    }

    const paidInvoices = await Invoice.find({ user_id: userId, paid: true, dateOfIssuing: { $gte: startDate, $lte: endDate } });
    const unpaidInvoices = await Invoice.find({ user_id: userId, paid: false, dueDate: {$gt: new Date()}, dateOfIssuing: { $gte: startDate, $lte: endDate } });
    const overdueInvoices = await Invoice.find({ user_id: userId, paid: false, dueDate: {$lt: new Date()}, dateOfIssuing: { $gte: startDate, $lte: endDate } });

    res.status(200).send({
      message: "Invoices stats found!",
      payload: {paidInvoices, unpaidInvoices, overdueInvoices},
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k získání všech faktur vydaných v každém měsíci v aktuálním roce
 * Method: `GET`
 * URL: `http://localhost:3000/invoice/annual`
 */
exports.getAllUserInvoiceAnnual = async (req, res) => {
  try {
    const userId = req.user.userId;

    const monthlyInvoices = {};

    for (let month = 0; month < 12; month++) {
      const startDate = new Date(new Date().getFullYear(), month, 1);
      const endDate = new Date(new Date().getFullYear(), month + 1, 0, 23, 59, 59, 999);

      const invoices = await Invoice.find({ user_id: userId, dateOfIssuing: { $gte: startDate, $lte: endDate } });
      monthlyInvoices[startDate.toLocaleString("cs-CZ", { month: "long" })] = invoices;
    }

    res.status(200).send({
      message: "Invoices found!",
      payload: monthlyInvoices,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k získání specifické faktury přihlášeného uživatele pomocí id
 * Method: `GET`
 * URL: `http://localhost:3000/invoice/:id`
 */
exports.getUserInvoiceById = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (!invoice)
      return res.status(404).json({ message: "Faktura nebyla nalezena" });
    if (invoice.user_id.toString() !== req.user.userId)
      return res.status(404).json({ message: "Faktura nebyla nalezena" });

    res.status(200).send({
      message: "Invoice found!",
      payload: invoice,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k vytvoření faktury
 * Method: `POST`
 * URL: `http://localhost:3000/invoice/`
 */
exports.createInvoice = async (req, res) => {
  try {
    const userId = req.body.user_id;
    const currentYear = new Date().getFullYear();
    const lastInvoiceData = await Invoice.findOne({ user_id: userId, invoice_id: { $regex: `^${currentYear}`}}).sort({ invoice_id: -1});
    let newInvoiceNumber = 1; 

    if(lastInvoiceData) {
      const lastInvoiceId = parseInt(lastInvoiceData.invoice_id.slice(4), 10);
      newInvoiceNumber = lastInvoiceId + 1;
    }

    const newInvoiceId = `${currentYear}${String(newInvoiceNumber).padStart(6, "0")}`;

    const data = new Invoice({
      user_id: req.body.user_id,
      contact_id: req.body.contact_id,
      invoice_id: newInvoiceId,
      orderNumber: req.body.orderNumber,
      description: req.body.description,
      dateOfIssuing: req.body.dateOfIssuing,
      dueDate: req.body.dueDate,
      duzp: req.body.duzp,
      paymentMethod: req.body.paymentMethod,
      paid: req.body.paid,
      statementSymbol: req.body.statementSymbol,
      products: req.body.products
    });
    const result = await data.save();

    if (result) {
      return res.status(201).send({
        message: "Invoice created!",
        payload: result,
      });
    }

    res.status(400).send({ message: "Wrong input!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/**
 * Funkce k upravení faktury
 * Method: `PUT`
 * URL: `http://localhost:3000/invoice/:id`
 */
exports.updateInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (invoice.user_id.toString() !== req.user.userId)
      return res.status(404).send({ message: "Faktura nenalezena." });

    const data = {
      user_id: req.body.user_id,
      orderNumber: req.body.orderNumber,
      description: req.body.description,
      dateOfIssuing: req.body.dateOfIssuing,
      dueDate: req.body.dueDate,
      duzp: req.body.duzp,
      paymentMethod: req.body.paymentMethod,
      paid: req.body.paid,
      statementSymbol: req.body.statementSymbol,
      products: req.body.products
    };

    const result = await Invoice.findByIdAndUpdate(req.params.id, data);
    if (result) {
      return res.status(200).send({
        message: "Invoice updated!",
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
 * Funkce ke smazání faktury
 * Method: `DELETE`
 * URL: `http://localhost:3000/invoice/:id`
 */
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findById(req.params.id);

    if (invoice.user_id.toString() !== req.user.userId)
      return res.status(404).send({ message: "Faktura nenalezena." });

    const data = {
      user_id: req.body.user_id,
      orderNumber: req.body.orderNumber,
      description: req.body.description,
      dateOfIssuing: req.body.dateOfIssuing,
      dueDate: req.body.dueDate,
      duzp: req.body.duzp,
      paymentMethod: req.body.paymentMethod,
      paid: req.body.paid,
      statementSymbol: req.body.statementSymbol,
      products: req.body.products
    };

    const result = await Invoice.findByIdAndDelete(req.params.id, data);
    if (result) {
      return res.status(200).send({
        message: "Invoice deleted!",
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
