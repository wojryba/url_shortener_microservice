var express = require('express');
var mongoose = require('mongoose');
var UrlModel = require('./schema');
var path = require('path');

var app = express();


var port = process.env.PORT || 3000;

app.get('/', function(req, res){
  res.sendFile('./url_shortner.html', {root: __dirname});
});

app.get('/new/*', function(req, res){
  var url = req.params[0];
  mongoose.connect(MONGODB_URI);
  //ensure we have a valid ulr, else throw error
  if (url.substring(0, 8)=="https://" ||
     url.substring(0, 7)=="http://") {

       //create new db entry for the site url's
       var dbUrl = new UrlModel({
         longUrl: url
       });
       dbUrl['shortUrl'] = dbUrl.id;

       //preper respons object
       var resp = {
         "original": url,
         "short": req.hostname +"/"+ dbUrl.id
       }

       //save the site to db
       dbUrl.save().then(function(){
         console.log("done");
       });
      mongoose.disconnect()
     }
  else {
    var resp = {
      "error": "Wrong url format, make sure you have a valid protocol and real site."
    };
  }
  //send respons object
  res.send(resp);
});

app.get('/*', function(req, res){

  //save the passed url
  var shortUrl = req.params[0];
  mongoose.connect(MONGODB_URI);
  //find the url in db, chose the long url, and sent it. or send an error
  UrlModel.findOne({'shortUrl': shortUrl}, 'longUrl', function(err, url){
    //if url is finde, redirect to the site
    if (url != null) {
      res.redirect(url.longUrl);
    }
    //else, send and error.
    var resObj = {"error": "This Url is not in the database"};
    res.send(resObj);
    });
    mongoose.disconnect()
});

app.listen(port);
