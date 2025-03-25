const mongoose = require("mongoose");

const invoiceSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    contact_id: { type: mongoose.Schema.Types.ObjectId, ref: "Contact", required: true},
    orderNumber: { type: Number, default: null},
    description: { type: String, required: true},
    dateOfIssuing: { type: Date, required: true},
    dueDate: { type: Date, required: true},
    dozp: { type: Date, required: true},
    paymentMethod: {type: String, enum: ["Bankovni prevod", "PayPal"], required: true},
    paid: {type: Boolean, required: true},
    statementSymbol: {type: Number, default: null},
    dateCreated: {type: Date, default: Date.now},
    products: [
        {
            amount: { type: Number, required: true},
            unit: { type: String, enum: ["ks", "hod", "den", "litr", "kg", "g", "m", "km", "m2", "m3", "baleni"], required: true},
            productName: { type: String, required: true},
            price: { type: Number, required: true},
            dph: { type: String, default: null},
            dphType: { type: String, enum: ["S DPH", "Bez DPH"], default: null },
            discount: { type: Number, default: null},
            discountType: { type: String, enum: ["Kc", "%"], default: null}
        }
    ]
});

module.exports = mongoose.model("Invoice", invoiceSchema);
