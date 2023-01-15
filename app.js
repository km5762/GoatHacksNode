const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 3000;

app.set('view engine', 'ejs');

//serve static pages. index and upload will stay as is. spots will be dynamic from server
const password = fs.readFileSync("./.env.txt", "utf-8").toString();

mongoose.connect(`mongodb+srv://sampleGoat:${password}@cluster0.6vhvr.mongodb.net/?retryWrites=true&w=majority`)
// mongoose.connect(`mongodb+srv://sampleGoat:${password}@cluster0.6vhvr.mongodb.net/GoatHacks`)
const schema = {
  location: String,
  area: String,
  rating: Number,
  description: String,
  img: String
}

app.get('/', (request, response) => {
  app.use(express.static(__dirname + '/public'))
  response.sendFile(__dirname + '/public/index.html');
})

app.get('/upload.html', (request, response) => {
  app.use(express.static(__dirname + '/public'))
  response.sendFile(__dirname + '/public/upload.html');
})

app.get('/views/test.ejs', (request, response) => {
  let name = 'myles';
  response.render(__dirname + '/views/test.ejs', {
      userName: name
  });
})

const Note = mongoose.model("Note", schema);
app.use(bodyParser.urlencoded({extended: true}));

//running
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
})