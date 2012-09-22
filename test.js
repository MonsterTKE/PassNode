var util = require("util");
var port = 8000;
my_http = require("http");
path = require("path");
url = require("url");
filesys = require("fs");
var winston = require('winston');
var requestData = require('request');
var logger = new (winston.Logger)({
  transports: [
                new (winston.transports.Console)(),
                new (winston.transports.File)({ filename: 'node.log' })
              ]
});

function password()
{
	var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for( var i=0; i < 2000; i++ )
       text += possible.charAt(Math.floor(Math.random() * possible.length));
    var first_stop = Math.random() * 1980;
    var second_stop = first_stop + 20;
    return text.substring(first_stop, second_stop);
}

my_http.createServer(function sendPassword (req,res)
{
  coin = Math.floor(Math.random(2)*2);
  if(coin)
  {
    logger.log('info',"Incoming request from " + req.connection.remoteAddress + ", Using Random.org Api, Coin toss = " + coin);
    req.pipe(requestData('https://www.random.org/passwords/?num=1&len=20&format=plain&rnd=new')).pipe(res);
  }
  else
  {
    logger.log('info',"Incoming request from " + req.connection.remoteAddress + ", Using password() function, Coin toss = " + coin);
    res.writeHeader(200, {"Content-Type": "application/json", "Access-Control-Allow-Origin": "*"});
    res.write(password());
    res.end();
  }
}).listen(port);

logger.log('info', 'Server Running on: ' + port);

//http://www.random.org/strings/?num=1&len=20&digits=on&upperalpha=on&loweralpha=on&unique=on&format=plain&rnd=new