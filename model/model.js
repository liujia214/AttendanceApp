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

var AttendanceModel = mongoose.model("attendance", new mongoose.Schema({
    //setting google id
    google_id: {
        type: String
    },
    date:{ type: Date },
    attendance:{ type: Boolean, default: false },
    timestamp:{ type: Date, default: Date.now },
}));

module.exports = {
    ContactModel: ContactModel,
    AttendanceModel:AttendanceModel,
};