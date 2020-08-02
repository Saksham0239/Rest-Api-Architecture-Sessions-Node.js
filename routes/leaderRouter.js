const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const leaderRouter = express.Router();
const Leaders=require('../models/leaders');


leaderRouter.use(bodyParser.json());
leaderRouter.route('/')
.get((req,res,next) => {
    Leaders.find({}).then(function(leaders){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leaders);
    })
    .catch(function(err){
        next(err);
    });
})
.post((req, res, next) => {
    Leaders.create(req.body)//body has already been parsed to jspn format because we are using body-parser middleware
    .then(function(leader){
        console.log('Leader Created',leader);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    })
    .catch(function(err){
        next(err);
    });
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /leaders');
})
.delete((req, res, next) => {
    Leaders.remove({})
    .then(function(response){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    })
    .catch(function(err){
        next(err);
    });
});



leaderRouter.route('/:leaderId')

.get((req,res,next) => {
    Leaders.findById(req.params.leaderId)
    .then(function(leader){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
    })
    .catch(function(err)
    {
        next(err);
    });
})
.post( (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /leaders/'+ req.params.leaderId);
})
.put((req, res, next) => {
  Leaders.findByIdAndUpdate(req.params.leaderId,{$set: req.body},{new:true})
    .then(function(leader){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(leader);
        })
        .catch(function(err)
                {
                    next(err);
                });
        })
.delete( (req, res, next) => {
    Leaders.findByIdAndRemove(req.params.leaderId)
    .then(function(response){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
        })
        .catch(function(err)
            {
            next(err);
            });
});





module.exports = leaderRouter;