
//A full fleged rest architecture

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



//////////////////////////////////////////Operations performed on comments//////////////////////////////////////////////////////

dishRouter.route('/:dishId/comments')
.get((req,res,next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments);//GET request displays all the comments 
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            dish.comments.push(req.body);//comments is an array inside dish header
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);//dish along with new pushed comment                
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put((req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /dishes/'
        + req.params.dishId + '/comments');
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null) {
            for (var i = (dish.comments.length -1); i >= 0; i--) {//This will traverse all the comments from the begining to end in reverse order
                dish.comments.id(dish.comments[i]._id).remove();//id of the respective comment is passed inside of the ().remove
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);//After all comments have been deleted                
            }, (err) => next(err));
        }
        else {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));    
});
///////////////////////////////////////////////////Operations on specific comments////////////////////////////////////////////

dishRouter.route('/:dishId/comments/:commentId')
.get((req,res,next) => {//will fetch a sepcific comment from a specific dish
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(dish.comments.id(req.params.commentId));//display the repective comment
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post((req, res, next) => {
    res.statusCode = 403;
    res.end('POST operation not supported on /dishes/'+ req.params.dishId
        + '/comments/' + req.params.commentId);
})
.put((req, res, next) => {//updating a specific comment or a ratings
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            if (req.body.rating) {
                dish.comments.id(req.params.commentId).rating = req.body.rating;
            }
            if (req.body.comment) {
                dish.comments.id(req.params.commentId).comment = req.body.comment;                
            }
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
})
.delete((req, res, next) => {
    Dishes.findById(req.params.dishId)
    .then((dish) => {
        if (dish != null && dish.comments.id(req.params.commentId) != null) {
            dish.comments.id(req.params.commentId).remove();//one complete comment  removed
            dish.save()
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(dish);                
            }, (err) => next(err));
        }
        else if (dish == null) {
            err = new Error('Dish ' + req.params.dishId + ' not found');
            err.status = 404;
            return next(err);
        }
        else {
            err = new Error('Comment ' + req.params.commentId + ' not found');
            err.status = 404;
            return next(err);            
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});




module.exports = dishRouter;
