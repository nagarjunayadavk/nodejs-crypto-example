/* 
   @author - Nagarjuna Yadav K
*/
//========= CryptoJS Decrypting ==============//
var CryptoJS = require("crypto-js");

var keySize = 128;
var iterations = 100;

exports.getFormattedDate = function () {
            var date = new Date();
            var str = date.getUTCFullYear() + "-" + ('0' + (date.getUTCMonth() + 1)).slice(-2) + "-" + ('0' + date.getUTCDate()).slice(-2) + " " + ('0' + date.getUTCHours()).slice(-2);
            return str;
        }

exports.encryptedMeassage = function(message) {
            //========= generate salt and iv for every Api call Dyanmically =========//
            var salt = CryptoJS.lib.WordArray.random(128 / 8);
            var iv = CryptoJS.lib.WordArray.random(128 / 8);
            //======= Password =========//
            var password = module.exports.getFormattedDate().toString();
            //=== key generation ========//
            var key128Bits100Iterations = CryptoJS.PBKDF2(password.toString(), salt, {
                keySize: keySize / 32,
                iterations: iterations
            });
            //======== Encript the message ==========//
            var encrypted = CryptoJS.AES.encrypt(message, key128Bits100Iterations, {
                iv: iv,
                mode: CryptoJS.mode.CBC,
                padding: CryptoJS.pad.Pkcs7
            });

            return salt + ':' + iv + ':' + encrypted.toString();
        }

exports.decryptedMessage = function(transitmessage, pass) {
	// console.log(transitmessage + "   "+pass);
	//======= Exatract Salt and IV ==========//
    var salt = CryptoJS.enc.Hex.parse(transitmessage.substr(0, 32));
    var iv = CryptoJS.enc.Hex.parse(transitmessage.substr(33, 32))
    var encryptedMessage = transitmessage.substring(66);
    
    //======== password-based key generation =========//
    var key = CryptoJS.PBKDF2(pass, salt, {
		keySize:  keySize/32,
		iterations: iterations
    });
    
    //========== Decrypt the message with key and IV =========//
    var decryptedMessage = CryptoJS.AES.decrypt(encryptedMessage, key, { 
	    iv: iv, 
	    padding: CryptoJS.pad.Pkcs7,
	    mode: CryptoJS.mode.CBC
    });
    // console.log("decryptedMessage === "+decryptedMessage.toString(CryptoJS.enc.Utf8));
  return decryptedMessage.toString(CryptoJS.enc.Utf8);
};


exports.decryptedMessageValid= function(authKey){
  console.log(authKey);
  var passwordKey = module.exports.getFormattedDate().toString();
  //========= Auth message read from manifest file =========//
  // var authMessage = process.env.authMessage;
  var authMessage = "Nagarjuna Yadav K";
  //======= Validate the  requester is correct or not ==========//
  return  module.exports.decryptedMessage(authKey,passwordKey) === authMessage;
}