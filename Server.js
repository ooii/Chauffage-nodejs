//Author: Farid Benbadis
//

var express = require("express");
var http = require("http");
var https = require("https");
var request = require('request');
var spark = require('spark');
var bodyParser = require('body-parser');
var expressHbs = require('express-handlebars');
var config = require('config');

var app = express();
var router = express.Router();
var path = __dirname + '/views/';

var callback = function(err, body) {
  console.log('API call login completed on callback:', body);
};

//Configuration
var spark = config.get('spark');
var token = spark.token
var device_id = spark.id

var chauffages_id = config.get('chauffages');

app.engine('hbs', expressHbs({extname:'hbs', defaultLayout:'main.hbs'}));
app.set('view engine', 'hbs');

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies

router.use(function (req,res,next) {
  console.log("/" + req.method);
  next();
});


router.get("/",function(req,res){
  var chauffages = [
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[1].name, id: '1', etat: '', disabled: chauffages_id[1].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[2].name, id: '2', etat: '', disabled: chauffages_id[2].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[3].name, id: '3', etat: '', disabled: chauffages_id[3].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[4].name, id: '4', etat: '', disabled: chauffages_id[4].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[5].name, id: '5', etat: '', disabled: chauffages_id[5].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[6].name, id: '6', etat: '', disabled: chauffages_id[6].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[7].name, id: '7', etat: '', disabled: chauffages_id[7].disabled}
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

router.post("/",function(req,res){
  var chauffages = [
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[1].name, id: '1', etat: '', disabled: chauffages_id[1].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[2].name, id: '2', etat: '', disabled: chauffages_id[2].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[3].name, id: '3', etat: '', disabled: chauffages_id[3].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[4].name, id: '4', etat: '', disabled: chauffages_id[4].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[5].name, id: '5', etat: '', disabled: chauffages_id[5].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[6].name, id: '6', etat: '', disabled: chauffages_id[6].disabled},
    {arret: false, eco: false, confort:false, horsgel:false, name: chauffages_id[7].name, id: '7', etat: '', disabled: chauffages_id[7].disabled}
  ];

  console.log("Changement état de tous les chauffages");
  params = '';
  for(var i in req.body)
    params += req.body[i]
  console.log(params);
  
  request({
    url: 'https://api.spark.io/v1/devices/'+device_id+'/fp?access_token='+token,
    method: 'POST',
    //Lets post the following key/values as form
    json: {
      params: params
    }}, function(error, response, body){
      if(response.statusCode != 200) {
        console.log(error);
        var data = {
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
