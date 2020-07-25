const express=require('express');

const http=require('http');
const bodyParser=require('body-parser');
const app=express();

const morgan=require('morgan');

const port=3000;

const host='localhost';
app.use(morgan('dev'));//used for getting logs on screen
app.use(bodyParser.json());//This will parse the body of the incoming request from the client and will add it to the req.body
app.use(express.static(__dirname+'/public'));//by default this will represent index.html file in the given statci folder.

app.all('/dishes',function(req,res,next)//This will always be executed irrespective of the the type of request given by the client 
{
    res.statusCode=200;
    res.header('Content-Type','text/plain');
    next();//looks for additional specifiactions which will match /dishes endpoint
});

app.get('/dishes',function(req,res,next)//modified object of re and res passes to this get method from app.all()
{
    res.end('Will Send the list of all dishes to you');
});

app.post('/dishes',function(req,res,next)
{
    res.end('Will add a new dish '+ req.body.name +' with details '+req.body.description);
});

app.put('/dishes',function(req,res,next)
{
    res.statusCode=403;//operation not succesfull
    res.end('PUT operation not supported for th endpoint /dishes');
});

app.delete('/dishes',function(req,res,next)
{
    res.end('Delete all the dishes');
});
//for a specific dish
app.get('/dishes/:dishID',function(req,res,next)//modified object of re and res passes to this get method from app.all()
{
    res.end('Will Send the details of the dish '+ req.params.dishID+' to you');
});

app.post('/dishes/:dishID',function(req,res,next)
{
    res.statusCode=403;//operation not succesfull
    res.end('POST request not supported for dishId '+req.params.dishID);
});

app.put('/dishes/:dishID',function(req,res,next)
{
    res.write('Updating the dish '+req.params.dishID);
    res.end('Will update the dish with name '+req.body.name+' and description '+req.body.description);
});

app.delete('/dishes/:dishID',function(req,res,next)
{
    res.end('Will delete the dish with id '+req.params.dishID);
});

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
