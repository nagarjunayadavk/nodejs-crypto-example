/* 
   @author - Nagarjuna Yadav K
   @email  - nagarjunayadavk@gmail.com
*/
var https = require('https');
var url = require('url');
var express = require( 'express');
var bodyParser = require('body-parser')
var app = express();
// create application/json parser
var jsonParser = bodyParser.json();

//====== Crypto JS Validation =============//
var cryptoJSValidation = require('./app/crypto/cryptoValidation.js');

//=== Point static path to app 
app.use(express.static(__dirname + '/app'));

//=== Get port from environment and store in Express.
var port  = process.env.PORT || 900;
app.listen(port, function () {
   console.log("Server Stated ======= in Port",port);
});

//======== Cors Orgin Request Set ========//
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, token, authKey ");
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');    
    next();
});

//========== REST Api's  =============//

//===== Get request test ============//
app.post('/encryption',function(req,res){
  console.log(req.headers['authkey']);
  response = { encryptionVal : cryptoJSValidation.encryptedMeassage(req.headers['authkey']) };
  res.end(JSON.stringify(response));
});

//===== Post request test ============//
app.post('/decryption',jsonParser,function(req,res){
  // // ======== password Key Time(or read from Manifest file.)=========//
  var passwordKey = cryptoJSValidation.getFormattedDate().toString();
  response = { decryptionVal : cryptoJSValidation.decryptedMessage(req.headers['authkey'],passwordKey) };
  res.end(JSON.stringify(response));
});