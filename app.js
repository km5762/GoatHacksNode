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
const uploadBaseUrl = `127.0.0.1:${port}/`;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('views', './views');
app.set('view engine', 'ejs');

const uri = `mongodb+srv://sampleGoat:${password}@cluster0.6vhvr.mongodb.net/?retryWrites=true&w=majority`;
const mongoConfig = { useNewUrlParser: true, useUnifiedTopology: true };



async function queryAll() {
  const client = new MongoClient(uri, mongoConfig);
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

app.use('/public', express.static('public'));

//TODO this serves images to validate
app.use('/uploads', express.static('uploads'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
})

app.get('/upload.html', (request, response) => {
  response.sendFile(__dirname + '/public/upload.html');
})

///form posting to mongo multerConfig single('photo')
app.post('/upload.html', multer(multerConfig).any(), async (req, res) => {
  const client = new MongoClient(uri, mongoConfig);
  try {
    const database = client.db('spotsDB');
    const studyspots = database.collection('studyspots');
    const filePath = uploadBaseUrl + req.files[0].path.replace(/\\/g, "/");

    const newCollection = {
      location: req.body.location,
      area: req.body.area,
      rating: req.body.rating,
      description: req.body.description,
      img: filePath
    }

    studyspots.insertOne(newCollection)
    res.redirect('/');

  } finally {
    await client.close();
  }
})

app.get('*', function (req, res) {
  res.send('No valid route found', 404);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})