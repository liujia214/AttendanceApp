var express = require('express');
var router = express.Router();
var model = require("../model/model");


router.use(function(req,res,next){
  if(req.user){
    next();
  }else{
    res.status(401).json({ message: "need to be authenticated before moving on" })
  }
});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/validate", function(req,res){
  model.ContactModel.findOne({google_id:req.user.id},function(err,result){
    if(!err){
      res.status(200).json(result);
    }
  });
});

//router.get('/profile',function(req,res){
//  model.ContactModel.findOne({google_id:req.user.id},function(err,result){
//    if(!err){
//      res.status(200).json(result);
//    }
//  });
//});

router.get('/contacts',function(req,res){
  model.ContactModel.find(function(err,result){
    if(!err){
      res.status(200).json(result);
    }
  })
});
router.get('/contacts/:id',function(req,res){
  console.log(req.params.id);
  model.ContactModel.find({google_id:req.params.id},function(err,result){
    if(!err){
      res.status(200).json(result);
    }
  })
});

router.put('/contact/:id', function (req, res) {
  model.ContactModel.findByIdAndUpdate(req.params.id,req.body,function(err,result){
    if(!err){
      res.status(200).json({message:'success'});
    }
  })
});

router.get('/attendance/:date',function(req,res){
  var date = decodeURIComponent(req.params.date);
  console.log(date);
  model.AttendanceModel.find({date:date}, function(err,result){
    if(!err){
      console.log(result);
      res.status(200).json(result);
    }
  })
})

router.put('/attendance',function(req,res){
  console.log(req.body);
  req.body.forEach(function(ele){
    model.AttendanceModel.find({google_id:ele.google_id,date:ele.date},function(err,result){
      console.log("result",result);
      if(!err) {
        if(result.length != 0){
          console.log("updating=================");
          model.AttendanceModel.update({google_id:ele.google_id,date:ele.date},{attendance:ele.attendance},function(err,update_result){
            console.log(update_result);
          });
        }else{
          //console.log({google_id:ele.google_id,date:ele.date,attendance:ele.attendance, timestamp:ele.timestamp});
          model.AttendanceModel.create({google_id:ele.google_id,date:ele.date,attendance:ele.attendance, timestamp:ele.timestamp},function(err,save_result){
            console.log(save_result);
          });
        }
      }else{
        console.log(err);
        res.status(500).json(err);
      }
    })
  });
  //res.status(200).json({message:"updaing successfully"});
})
module.exports = router;
