const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 3000;
app.use(bodyParser.urlencoded({extended: true}));

app.set('view engine', 'ejs');

//serve static pages. index and upload will stay as is. spots will be dynamic from server
const password = fs.readFileSync("./.env.txt", "utf-8").toString();

// connect to mongoosedb
const { MongoClient } = require("mongodb");
const uri = `mongodb+srv://sampleGoat:${password}@cluster0.6vhvr.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri);

async function queryAll() {
  try {
    const database = client.db('spotsDB');
    const studyspots = database.collection('studyspots');
    const query = {};
    const spot = await studyspots.find(query).toArray();
    console.log(spot);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
queryAll().catch(console.dir);

const schema = {
  location: String,
  area: String,
  rating: Number,
  description: String,
  img: String
}

const Note = mongoose.model("Note", schema);
const Spot = mongoose.model("studyspots", schema);

app.use('/public', express.static('public'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
})

app.get('/upload.html', (request, response) => {
  response.sendFile(__dirname + '/public/upload.html');
})

app.get('/views/spots.ejs', (request, response) => {
  Spot.find({}, function(err, spots) {
    response.render('spots', {
      spotsList: spots
    })
  })
})

//running
app.listen(port, function() {
  console.log(`Example app listening on port ${port}`);
})