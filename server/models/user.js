const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    // Přihlašovací údaje
    first_name: { type: String, required: true},
    last_name: { type: String, required: true},
    email: { type: String, unique: true, required: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    password: { type: String, required: true},
    profilePicture: { type: String, default: null},

    // Osobní údaje
    detailsName: { type: String, default: null},
    ico: { type: String, default: null},
    hasIco: { type: Boolean, default: false},

    // Adresní údaje
    street: { type: String, default: null},
    city: { type: String, default: null},
    zipCode: { type: String, default: null},

    // Kontaktní údaje
    phone: { type: String, default: null},
    website: { type: String, default: null},

    // Platební údaje 
    accountNumber: { type: String, default: null},
    iban: { type: String, default: null},
    swift: { type: String, default: null},

    // Daňové údaje
    dph: { type: String, enum: ["Neplátce DPH", "Plátce DPH"], default: "Neplátce DPH" },
    dic: { type: String, default: null},

    // Personalizace 
    invoiceLogo: { type: String, default: null},

    // Ostatní
    createdAt: { type: Date, default: Date.now}
});

module.exports = mongoose.model("User", userSchema);