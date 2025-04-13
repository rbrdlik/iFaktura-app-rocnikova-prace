const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: true},
    invoice_id: { type: String, required: true},
    orderNumber: { type: String, default: null},
    description: { type: String, required: true},
    dateOfIssuing: { type: Date, required: true},
    dueDate: { type: Date, required: true},
    duzp: { type: Date, default: null},
    paymentMethod: {type: String, enum: ["Bankovní převod", "PayPal", "Dobírkou"], required: true},
    paid: {type: Boolean, required: true},
    dateCreated: {type: Date, default: Date.now},
    products: [
        {
            amount: { type: Number, required: true},
            unit: { type: String, enum: ["ks", "hod.", "den", "litr", "kg", "g", "m", "km", "m²", "m³", "balení"], required: true},
            productName: { type: String, required: true},
            price: { type: Number, required: true},
            dph: { type: String, default: null},
            dphType: { type: String, enum: ["S DPH", "Bez DPH"], default: null },
            discount: { type: Number, default: null},
            discountType: { type: String, enum: ["Kč", "%"], default: null}
        }
    ]
});

module.exports = mongoose.model("Invoice", invoiceSchema);
