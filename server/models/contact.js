const mongoose = require("mongoose");

const contactSchema = mongoose.Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true},
    detailsName: { type: String, required: true},
    ico: { type: String, default: null},
    street: { type: String, required: true},
    city: { type: String, required: true},
    zipCode: { type: String, required: true},
    phone: { type: String, default: null},
    website: { type: String, default: null},
    email: { type: String, required: true, match: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/ },
    dic: { type: String, default: null},
});

module.exports = mongoose.model("Contact", contactSchema);
