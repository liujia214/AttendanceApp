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
    photo:String,
    type:String, //supervisor,staff,student
    supervisor:String,
    status:String,
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
    user_id:String,
    date:{ type: Date },
    attendance:{ type: Boolean, default: false },
    comment:{type:String},
    timestamp:{ type: Date, default: Date.now() }
}));

var LogModel = mongoose.model('log',new mongoose.Schema({
    google_id:String,
    changer_id:String,
    date:{type:Date},
    attendance:{type:Boolean},
    timestamp:{type:Date,default:Date.now()}
}));

var RequestModel = mongoose.model('request',new mongoose.Schema({
    receiver:String,
    timestamp:{type:String,default:Date.now()}
}));

var ReminderModel = mongoose.model('reminder',new mongoose.Schema({
    type:String,
    Time:String,
    escalation:String,
    buffer:String
}));

module.exports = {
    ContactModel: ContactModel,
    AttendanceModel:AttendanceModel,
    LogModel:LogModel,
    RequestModel:RequestModel,
    ReminderModel:ReminderModel
};