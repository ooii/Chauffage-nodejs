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
    url = 'https://api.spark.io/v1/devices/'+device_id+'/etatfp?access_token='+token
    request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      reponse = JSON.parse(body);
      console.log(reponse.result);
      res.send(reponse.result)
    }
  });
});

router.post("/chauffage",function(req,res){
  console.log("Changement état de tous les chauffages")
  //url = 'https://api.spark.io/v1/devices/'+device_id+'/fp?access_token='+token
  //request(url, function (error, response, body) {
  //  if (!error && response.statusCode == 200) {
  //    reponse = JSON.parse(body);
  //    console.log(reponse.result);
  //    res.send(reponse.result)
  //  }
  //});

  request({
    url: 'https://api.spark.io/v1/devices/'+device_id+'/fp?access_token='+token,
    qs: {from: 'blog example', time: +new Date()}, //Query string data
    method: 'POST',
    //Lets post the following key/values as form
    json: {
      //access_token: token,
      params: 'AAAAEAA'
    }}, function(error, response, body){
      if(error) {
        console.log(error);
      } else {
        console.log(response.statusCode, body);
      }
    });
});


app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(3000,function(){
  console.log("Live at Port 3000");
});
//spark.login({accessToken: token}, callback);

//spark.claimCore(device_id, function(err, data) {
//  console.log('spark.claimCore err:', err);
//  console.log('spark.claimCore data:', data);
//});

//spark.listDevices(function(err, devices) {
//  var device = devices[0];
//  console.log(device)
//
//  console.log('Device name: ' + device.name);
//  console.log('- connected?: ' + device.connected);
//  console.log('- variables: ' + device.variables);
//  console.log('- functions: ' + device.functions);
//  console.log('- version: ' + device.version);
//  console.log('- requires upgrade?: ' + device.requiresUpgrade);
//});

//spark.getDevice(device_id, function(err, device) {
//  console.log('Device name: ' + device.name);
//});

