const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const port = 3000;
const password = fs.readFileSync("./.env.txt", "utf-8").toString();
const { MongoClient } = require("mongodb");
var spotstList;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


// connect to mongoosedb
const url = `mongodb+srv://sampleGoat:${password}@cluster0.6vhvr.mongodb.net/?retryWrites=true&w=majority`;

const schema = new mongoose.Schema({
  location: {type: String},
  area: {type: String},
  rating: {type: Number},
  description: {type: String},
  img: {type: String},
});

app.use('/public', express.static('public'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
})

app.get('/upload.html', (request, response) => {
  response.sendFile(__dirname + '/public/upload.html');
})

app.get('/views/spots.ejs', (request, response) => {
  MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("spotsDB");
      var query = {};
      dbo.collection("studyspots").find(query).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        response.render('spots', {spotList : result})
    });
  });
})

//running
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
})