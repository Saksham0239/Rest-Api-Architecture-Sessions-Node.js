const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
var User = require('../models/user');
const router = express.Router();
var passport = require('passport');


router.use(bodyParser.json());



router.post('/signup', (req, res, next) => {
  console.log(req.body);
    User.register(new User({username: req.body.username}),req.body.password,function(err,user){
      if(err)
      {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({err: err});
      }
      else
      {
        passport.authenticate('local')(req,res, function(){
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({success: true, status: 'Registration Successful!'});
        });
      }
    });
  });
  
  router.post('/login',passport.authenticate('local'), (req, res) => {
  
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.json({success: true, status: 'You are successfully logged in!'});
  });
  
  router.get('/logout', (req, res) => {
    console.log(req.session);
    if (req.session) {
      req.session.destroy();//destroys the server side session
      res.clearCookie('session-Id');//cookie cleared on client side
      res.redirect('/');
    }
    else {
      var err = new Error('You are not logged in!');
      err.status = 403;
      next(err);
    }
  });


  module.exports=router;