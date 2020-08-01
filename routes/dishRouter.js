const express = require('express');
const bodyParser = require('body-parser');
const mongoose=require('mongoose');
const dishRouter = express.Router();
const Dishes=require('../models/dishes');

dishRouter.use(bodyParser.json());
dishRouter.route('/')

.get((req,res,next) => {
    Dishes.find({}).then(function(dishes){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dishes);
    })
    .catch(function(err){
        next(err);
    });
})
.post((req, res, next) => {
    Dishes.create(req.body)//body has already been parsed to jspn format because we are using body-parser middleware
    .then(function(dish){
        console.log('Dish Created',dish);
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    })
    .catch(function(err){
        next(err);
    });
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes');
})
.delete((req, res, next) => {
    Dishes.remove({})
    .then(function(response){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(response);
    })
    .catch(function(err){
        next(err);
    });
});



dishRouter.route('/:dishId')

.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then(function(dish){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
    })
    .catch(function(err)
    {
        next(err);
    });
})
.post( (req, res, next) => {
  res.statusCode = 403;
  res.end('POST operation not supported on /dishes/'+ req.params.dishId);
})
.put((req, res, next) => {
  Dishes.findByIdAndUpdate(req.params.dishId,{$set: req.body},{new:true})
    .then(function(dish){
        res.statusCode=200;
        res.setHeader('Content-Type','application/json');
        res.json(dish);
        })
        .catch(function(err)
                {
                    next(err);
                });
        })
.delete( (req, res, next) => {
    Dishes.findByIdAndRemove(req.params.dishId)
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




module.exports = dishRouter;
