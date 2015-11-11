var mongoose = require("mongoose");

var ContactModel = mongoose.model("contact", new mongoose.Schema({

    //setting google id
    google_id: {
        unique: true,
        type: String
    },
    google_user: mongoose.Schema.Types.Mixed,
    name: {
        first: String,
        last: String
    },
    email: String,
    textarea: String
}));

module.exports = {
    ContactModel: ContactModel
};