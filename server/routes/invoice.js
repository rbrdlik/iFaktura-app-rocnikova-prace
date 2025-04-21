const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoice");
const auth = require("../middlewares/auth");

router.get("/", auth, invoiceController.getAllUserInvoice)
router.get("/annual", auth, invoiceController.getAllUserInvoiceAnnual)
router.get("/:id", auth, invoiceController.getUserInvoiceById)
router.get("/stats/:period", auth, invoiceController.getAllUserInvoiceStats)
router.post("/", auth, invoiceController.createInvoice)
router.put("/:id", auth, invoiceController.updateInvoice)
router.delete("/:id", auth, invoiceController.deleteInvoice)

module.exports = router;