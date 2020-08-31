'use strict';
require('dotenv').config()
var express = require('express');
var mongo = require('mongodb');
var mongoose = require('mongoose');
var bodyParser = require('body-parser')
var cors = require('cors');


var Url = require('./URL-model');
const { estimatedDocumentCount } = require('./URL-model');

var app = express();

const uri = process.env.MONGO_URI || 'mongodb://localhost/afternoon-spire-46222';
// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
// mongoose.connect(process.env.DB_URI);
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
// app.get("/api/shorturl/new", function (req, res) {
  
// });

// Url.deleteMany({ short_url: /[0-9]/g}, (err, doc) => {
//   if (err) {
//     console.log(err)
//   }
//   console.log(doc)
// })



app.post("/api/shorturl/new",  function(req, res) {
  
 let originalURL = req.body.url;
 


   Url.findOne()
          .sort({ short_url: -1 })
          .exec((err, doc) => {
let prevNum;
let shortUrl;
           
            if (err) {
          console.log(err)
          }
          
    if (doc === null && !err) {
      console.log("nothing found")
      shortUrl = 1;
      Url.findOneAndUpdate({ original_url: originalURL }, { original_url: originalURL, short_url: shortUrl }, { new: true, upsert: true })
      .exec((err, doc) => {
        if (err) {
          return err
        }
        // console.log(doc)
        res.json({ original_url: originalURL, short_url: shortUrl })
      })
    }
   
    
 else if (!err && checkUrl(originalURL) !== false) {
      
      
        prevNum = parseInt(doc.short_url)
        shortUrl = prevNum + 1;
      
      
      console.log(prevNum, shortUrl)
    
     
       Url.findOneAndUpdate({ original_url: originalURL }, { original_url: originalURL, short_url: shortUrl }, { new: true, upsert: true })
      .exec((err, doc) => {
        if (err) {
          return err
        }
        // console.log(doc)
        res.json({ original_url: originalURL, short_url: shortUrl })
      })
    } else {
      res.json({ error: "Invalid URl" })
    }
  })
  
          
})

app.get("/api/shorturl/:num?", function (req, res) {
  let num = req.params.num;
  
  Url.findOne({ short_url: num }, (err, doc) => {
    if (err) return err;
    else if (!err && !doc) {
      res.json({message: "URL not found in database"})
    } else {
    res.redirect(doc.original_url)
    }
  })
  // res.json({message: "redirecting" })
  
});

function checkUrl(string) {
  let url;

  try {
    url = new URL(string)
  } catch (error) {
    return false;
  }
  
return url.protocol == "http:" || url.protocol == "https:"
}

app.listen(port, function () {
  console.log('Node.js listening ...');
});

