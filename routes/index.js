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
  res.status(200).json(req.user);
  console.log(req.user, "this is from index.js line 11")
});

router.post('/contact', function (req, res) {
  (new models.CandidateModel(req.body)).save(function (err, result) {
    if (err) res.status(500).json({error: err});
    else res.status(201).json({result: result});
  });
});

module.exports = router;
