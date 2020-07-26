const express=require('express');

const http=require('http');
const bodyParser=require('body-parser');
const app=express();

const morgan=require('morgan');
const dishRouter = require('./routes/dishRouter');
const promoRouter = require('./routes/promoRouter');
const leaderRouter = require('./routes/leaderRouter');
const port=3000;

const host='localhost';
app.use(morgan('dev'));//used for getting logs on screen
app.use(bodyParser.json());//This will parse the body of the incoming request from the client and will add it to the req.body
app.use(express.static(__dirname+'/public'));//by default this will represent index.html file in the given statci folder.
app.use('/dishes', dishRouter);
app.use('/promos',promoRouter);
app.use('/leaders',leaderRouter);

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
