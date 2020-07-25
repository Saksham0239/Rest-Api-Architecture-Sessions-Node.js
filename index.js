const express=require('express');

const http=require('http');

const app=express();

const port=3000;

const host='localhost';
app.use(function(req,res,next)
{
    console.log(req.headers);

    res.statusCode=200;
    res.header('content-type','text/html');
    res.end('<html><body><h1>This is an express server</h1></body></html>');
});


const server=http.createServer(app);


server.listen(port,host, function(){
    console.log('Server started at http//:'+host+':'+port);
});
