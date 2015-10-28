var express = require("express");
var http = require("http");
var https = require("https");
var request = require('request');
var spark = require('spark');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');

var app = express();
var router = express.Router();
var path = __dirname + '/views/';
var token = "fcbe032df90e37d22e31ae006d4f71c5b92f2d96"
var device_id = "54ff6b066672524852431867"

var callback = function(err, body) {
  console.log('API call login completed on callback:', body);
};

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});
//router.get('/', function(req, res){
//  res.render('index');
//});
//app.get('/loop', function(req, res){
//  var basketballPlayers = [
//    {name: 'Lebron James', team: 'the Heat'},
//    {name: 'Kevin Durant', team: 'the Thunder'},
//    {name: 'Kobe Jordan',  team: 'the Lakers'}
//  ];
//  
//  var days = [
//    'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'
//  ];
//  
//  var data = {
//    basketballPlayers: basketballPlayers,
//    days: days
//  };
//  
//  res.render('loop', data);
//});
//router.get("/",function(req,res){
//  res.sendFile(path + "index.html");
//});


router.get("/about",function(req,res){
  res.sendFile(path + "about.html");
});

router.get("/contact",function(req,res){
  res.sendFile(path + "contact.html");
});

router.get("/",function(req,res){
  var chauffages = [
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Entrée', id: '1', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Emma', id: '2', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Cuisine', id: '3', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Milieu', id: '4', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Salon', id: '5', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'SDB', id: '6', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Douche', id: '7', etat: ''}
  ];

  console.log("Récupération état de tous les chauffages");
  url = 'https://api.spark.io/v1/devices/'+device_id+'/etatfp?access_token='+token;
  request(url, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      reponse = JSON.parse(body);
      var etats = reponse.result.split('');
      for (var i=0;i<7;i++) {
        if (etats[i] == "A") {
          chauffages[i].etat = etats[i];
          chauffages[i].arret = true;
          console.log(chauffages[i].name, chauffages[i].etat);
        } else if (etats[i] == "E") {
          chauffages[i].etat = etats[i];
          chauffages[i].eco = true;
          console.log(chauffages[i].name, chauffages[i].etat);
        } else if (etats[i] == "H") {
          chauffages[i].etat = etats[i];
          chauffages[i].horsgel = true;
          console.log(chauffages[i].name, chauffages[i].etat);
        } else if (etats[i] == "C") {
          chauffages[i].etat = etats[i];
          chauffages[i].confort = true;
          console.log(chauffages[i].name, chauffages[i].etat);
        }
      };
      var data = {
        chauffages: chauffages,
        valeurOK : 'hidden',
        valeurNOK : 'hidden'
      };
      res.render('index', data)
    };
  });
});

//router.get('/simple', function(req, res){
//  var data = {name: 'Gorilla'};
//  res.render('simple', data);
//});
//
//router.get('/logic', function(req, res){
//  var data = {
//    upIsUp: true,
//    downIsUp: false,
//    skyIsBlue: "yes"
//  };
//  
//  res.render('logic', data);
//});

router.post("/",function(req,res){
  var chauffages = [
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Entrée', id: '1', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Emma', id: '2', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Cuisine', id: '3', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Milieu', id: '4', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Salon', id: '5', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'SDB', id: '6', etat: ''},
    {arret: false, eco: false, confort:false, horsgel:false, name: 'Douche', id: '7', etat: ''}
  ];

  console.log("Changement état de tous les chauffages");
  params = '';
  for(var i in req.body)
    params += req.body[i]
  console.log(params);
  
  request({
    url: 'https://api.spark.io/v1/devices/'+device_id+'/fp?access_token='+token,
    //qs: {from: 'blog example', time: +new Date()}, //Query string data
    method: 'POST',
    //Lets post the following key/values as form
    json: {
      //access_token: token,
      params: params
    }}, function(error, response, body){
      if(response.statusCode != 200) {
        console.log(error);
        var data = {
          //chauffages: chauffages,
          valeurOK : 'hidden',
          valeurNOK : '',
        };
      } else {
        for (var i=0;i<7;i++) {
          if (params[i] == "A") {
            chauffages[i].etat = params[i];
            chauffages[i].arret = true;
            console.log(chauffages[i].name, chauffages[i].etat);
          } else if (params[i] == "E") {
            chauffages[i].etat = params[i];
            chauffages[i].eco = true;
            console.log(chauffages[i].name, chauffages[i].etat);
          } else if (params[i] == "H") {
            chauffages[i].etat = params[i];
            chauffages[i].horsgel = true;
            console.log(chauffages[i].name, chauffages[i].etat);
          } else if (params[i] == "C") {
            chauffages[i].etat = params[i];
            chauffages[i].confort = true;
            console.log(chauffages[i].name, chauffages[i].etat);
          }
        };
        var data = {
          chauffages: chauffages,
          valeurOK : '',
          valeurNOK : 'hidden',
        };
       }
      res.render('index', data)
    });
});


app.use("/",router);

app.use("*",function(req,res){
  res.sendFile(path + "404.html");
});

app.listen(9999, function(){
  console.log("Live at Port 9999");
});
