var express = require("express");
var http = require("http");
var https = require("https");
var request = require('request');
var spark = require('spark');
var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var token = "fcbe032df90e37d22e31ae006d4f71c5b92f2d96"
var device_id = "54ff6b066672524852431867"

var callback = function(err, body) {
  console.log('API call login completed on callback:', body);
};

function etatfp(device_id, token, callback) {

    return https.get({
        host: 'api.spark.io',
        path: '/v1/devices/'+device_id+'/etatfp?access_token='+token
    }, function(response) {
        // Continuously update stream with data
        var body = '';
        response.on('data', function(d) {
            body += d;
        });
        response.on('end', function() {
            // Data reception is done, do whatever with it!
            var parsed = JSON.parse(body);
            callback({
                response: response.statusCode,
                etat: parsed.result
            });
        });
    });

}


//etatfp = function(device_id, token, callback){
//  var options = {
//      host: 'api.spark.io',
//      path: '/v1/devices/'+device_id+'/etatfp?access_token='+token
//    };
//  callback = function(response) {
//    var str = '';
//    //another chunk of data has been recieved, so append it to `str`
//    response.on('data', function (chunk) {
//      str += chunk;
//    });
//  
//    //the whole response has been recieved, so we just print it out here
//    response.on('end', function () {
//      console.log(response.statusCode);
//      console.log(str);
//      rep = JSON.parse(str);
//      return(rep);
//    });
//  }
//  https.request(options, callback).end();
//}

app.use(express.static('public'));
url = 
router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});

router.get("/",function(req,res){
  res.sendFile(path + "index.html");
});

router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

router.get("/chauffage",function(req,res){
    console.log("Récupération état de tous les chauffages")
    //etatfp(device_id, token, function(etat){
    //  console.log(etat);
    //  
    //});
    //res.JSON(etat)
    request('https://api.spark.io/v1/devices/54ff6b066672524852431867/etatfp?access_token=fcbe032df90e37d22e31ae006d4f71c5b92f2d96', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      console.log(body);
    }
  });
});

router.get("/chauffage/:chauffage_id",function(req,res){
  res.sendFile(path + "contact.html");
});

app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
spark.login({accessToken: token}, callback);
//spark.login({accessToken: token}).then(
//  function(token){
//    console.log('API call completed on promise resolve: ', token);
//  },
//  function(err) {
//    console.log('API call completed on promise fail: ', err);
//  }
//);

spark.claimCore(device_id, function(err, data) {
  console.log('spark.claimCore err:', err);
  console.log('spark.claimCore data:', data);
});

spark.listDevices(function(err, devices) {
  var device = devices[0];
  console.log(device)

  console.log('Device name: ' + device.name);
  console.log('- connected?: ' + device.connected);
  console.log('- variables: ' + device.variables);
  console.log('- functions: ' + device.functions);
  console.log('- version: ' + device.version);
  console.log('- requires upgrade?: ' + device.requiresUpgrade);
});

spark.getDevice(device_id, function(err, device) {
  console.log('Device name: ' + device.name);
});

//device.callFunction('setFp', 'D0:HIGH', function(err, data) {
//  if (err) {
//    console.log('An error occurred:', err);
//  } else {
//    console.log('Function called succesfully:', data);
//  }
//});
