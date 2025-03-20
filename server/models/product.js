const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    amount: { type: Number, required: true},
    unit: { type: String, enum: ["ks", "hod.", "den", "litr", "kg", "g", "m", "km", "m²", "m³", "balení"], required: true},
    productName: { type: String, required: true},
    price: { type: Number, required: true},
    dph: { type: String, enum: ["0 %", "11 %", "21 %"], default: null},
    dphType: { type: String, enum: ["S DPH", "Bez DPH"], default: null },
    discount: { type: Number, default: null},
    discountType: { type: String, enum: ["Kč", "%"], default: null}
});

module.exports = mongoose.model("Product", productSchema);