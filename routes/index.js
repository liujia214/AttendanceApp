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

router.get('/admin',function(req,res){
  model.ContactModel.find(function(err,result){
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

module.exports = router;
