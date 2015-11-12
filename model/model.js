var mongoose = require("mongoose");

var ContactModel = mongoose.model("googleUser", new mongoose.Schema({

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
    type:String,
    address:{
        github:String,
        linkedin:String
    }
}));

module.exports = {
    ContactModel: ContactModel
};