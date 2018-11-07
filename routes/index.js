var express = require('express');
var router = express.Router();
var User = require("../models/user");
var xss = require('xss');

function ensureAuthentication(req, res, next){
  if(req.session.user_id && req.cookies['connect.sid'])
    return next();
  else {
    res.render('index', {
      message : "Unauthorized to perform this action"
    })
  }
};

function getUserInfo(req, res, next){
  User.getUserById(req.session.user_id, function(err_user, res_user){
    if(err_user){
      res.status(400).send({
        message: "Unable to get user information"
      });
    }
    else{
      var result = {
        name : res_user.name,
        _id : res_user._id,
        username : res_user.useranme,
        email : res_user.email
      };
      return  next(result, req, res, next);
    }
  });
};

router.get('/', [ensureAuthentication, getUserInfo], function(result, req, res, next){
  res.render('home', {
    message : "Welcome " + result.name +", You are logged in"
  });
});

module.exports = router;
