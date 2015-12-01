/**
 * Created by allenbklj on 11/30/15.
 */
var nodemailer = require('nodemailer');
var model = require("../model/model");

var userlist = [];
var userIds = [];
var attendance = [];
var usersCheckedin = [];
// send request to users at 10am and 11am
model.ContactModel.find(function(err,result){
    if(!err){
        userlist = result;
        model.AttendanceModel.find({date:new Date().toDateString()}, function(err,result){
            if(!err){
                attendance = result;
                userlist.forEach(function(ele){
                    userIds.push(ele.google_id);
                });
                attendance.forEach(function(ele){
                    usersCheckedin.push(ele.google_id);
                });
                userIds = userIds.filter(function(id){
                    if(usersCheckedin.indexOf(id) === -1){
                        model.ContactModel.findOne({google_id:id},function(err,result){
                            sendEmail(result.email);
                            model.RequestModel.create({receiver:id});
                        });
                    }
                    return usersCheckedin.indexOf(id) === -1;
                });
            }
        });
    }
});

// send request to supervisor at 12pm
userIds.forEach(function(id){
    if(usersCheckedin.indexOf(id) === -1){
        model.ContactModel.findOne({google_id:id},function(err,result){
            var supervisor = result.supervisor;
            model.ContactModel.findOne({google_id:supervisor},function(err,result){
                if(!err){
                    sendEmail(result.email);
                    model.RequestModel.create({receiver:supervisor});
                }
            });
        });
    }
});


function sendEmail(receivers){
    var transporter = nodemailer.createTransport({
        service:'Gmail',
        auth:{
            user:'golivelabs@gmail.com',
            pass:'789uioJKL'
        }
    });

    var mailOptions = {
        from:'golivelabs@gmail.com',
        sender:'admin@golivelabs.com',
        to:receivers,
        subject:'Check In Please',
        text:"You haven't checked in today",
        html:"<b>You haven't checked in today</b>"
    };
    transporter.sendMail(mailOptions,function(error,info){
        if(error){
            return console.log(error);
        }
        console.log(info);

    });
}






