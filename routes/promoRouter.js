const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const Promotions=require('../models/promotions');
const promoRouter = express.Router();


promoRouter.use(bodyParser.json());
promoRouter.route('/')
.get((req,res,next) => {
    Promotions.find({}).then(function(promotions){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotions);
    })
    .catch(function(err){
        next(err);
    });
})
.post((req, res, next) => {
    Promotions.create(req.body)//body has already been parsed to jspn format because we are using body-parser middleware
    .then(function(promotion){
        console.log('Promotion Created',promotion);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promotion);
    })
    .catch(function(err){
        next(err);
    });
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /promotions');
})
.delete((req, res, next) => {
    Promotions.remove({})
    .then(function(response){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    })
    .catch(function(err){
        next(err);
    });
});



promoRouter.route('/:promoId')
.get((req,res,next) => {
    Promotions.findById(req.params.promoId)
    .then(function(promo){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
    })
    .catch(function(err)
    {
        next(err);
    });
})
.post( (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /promotions/'+ req.params.promoId);
})
.put((req, res, next) => {
  Promotions.findByIdAndUpdate(req.params.promoId,{$set: req.body},{new:true})
    .then(function(promo){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(promo);
        })
        .catch(function(err)
                {
                    next(err);
                });
        })
.delete( (req, res, next) => {
    Promotions.findByIdAndRemove(req.params.promoId)
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



module.exports = promoRouter;