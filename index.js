var httpsActive=true;
var https=require("https");
var http=require("http");
var express = require('express');
var app = express();
var fs = require("fs");
var MutexPromise = require('mutex-promise');
var formidable = require('formidable');
var exec = require('child_process').exec;
var expressSession = require('express-session');
var cookieParser = require('cookie-parser');
var port = 80; 
var sslPort=443;
var seedrandom=require("seedrandom");
const PORT = port; 

app.use(express.static(__dirname));
app.get('/',function(req,res){
	res.sendfile('./demos/menu.html');
});
var heroku=false;
try{
	var privateKey  = fs.readFileSync('./privkey.pem', 'utf8');
	var certificate = fs.readFileSync('./fullchain.pem', 'utf8');
		var credentials = {key: privateKey, cert: certificate}
}catch(err){
	try{var privateKey  = fs.readFileSync('../privkey.pem', 'utf8');
	var certificate = fs.readFileSync('../fullchain.pem', 'utf8');
	var credentials = {key: privateKey, cert: certificate}
	}catch(err){
		console.log("could not find ssl files, hoping you are running on heroku i guess");
		httpsActive=false;
		port=process.env.PORT;
	}
}
http.createServer(app).listen(port)
if(httpsActive){
	/*http.createServer(function (req, res) {
    		res.writeHead(301, { "Location": "https://" + req.headers['host'] + req.url });
    		res.end();
	}).listen(80);
	*/
	https.createServer(credentials, app).listen(sslPort);
	
}
