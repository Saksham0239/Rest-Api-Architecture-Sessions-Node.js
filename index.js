const express=require('express');

const http=require('http');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const app=express();
const cookieParser=require('cookie-parser');
const session=require('express-session');
const fileStore=require('session-file-store')(session);

const morgan=require('morgan');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const port=3000;
const url="mongodb://localhost:27017/DishesDb";

const Dishes=require('./models/dishes');
const Promotions=require('./models/promotions');
const Leaders=require('./models/promotions');

const host='localhost';
app.use(morgan('dev'));//used for getting logs on screen
app.use(bodyParser.json());//This will parse the body of the incoming request from the client and will add it to the req.body
// app.use(cookieParser('1234-5678-9101112'));//secret string for accessing the cookie by server
//before providing static files we provide authentication

app.use(session({
    name: 'session-Id',
    secret: '1234-5678-9101112',
    saveUninitialized: false,
    resave: false,
    store: new fileStore()
}));

function auth(req,res,next){
    if(!req.session.user){
        console.log(req.session);
        var authHeader = req.headers.authorization;
        if(!authHeader){
            var err=new Error('You are Not Authenticated');
            res.setHeader('WWW-Authenticate', 'Basic');
            err.status=401;
            next(err);
            return;
        }
      var auth = new Buffer.from(authHeader.split(' ')[1], 'base64').toString().split(':');
       var user = auth[0];
       var pass = auth[1];
       if (user == 'admin' && pass == 'password') {
           req.session.user='admin';
           next(); // authorized
       } else {
           var err = new Error('You are not authenticated!');
           res.setHeader('WWW-Authenticate', 'Basic');      
           err.status = 401;
           next(err);
       }
    }

    else
    {
        console.log(req.session);
        if(req.session.user=='admin'){
            next();//move on to the next middleware
        }
        else{
            var err=new Error('Send the correct user name, Authentification Failed');
            err.status=401;
            next(err);
        }
    }
   
}



app.use(auth);
app.use(express.static(__dirname+'/public'));//by default this will represent index.html file in the given statci folder.
app.use('/dishes', dishRouter);
app.use('/promotions',promoRouter);
app.use('/leaders',leaderRouter);



//DataBase Connection

const connection=mongoose.connect(url,{useNewUrlParser: true, useUnifiedTopology: true});
connection.then(function(db){
    console.log('Successfully Connected to the database');
})
.catch(function(err){console.error(err);});

//DataBase Connection

app.use(function(req,res,next)
{
    // console.log(req.headers);

    res.statusCode=200;
    res.header('content-type','text/html');
    res.end('<html><body><h1>This is an express server</h1></body></html>');
});


const server=http.createServer(app);


server.listen(port,host, function(){
    console.log('Server started at http//:'+host+':'+port);
});
