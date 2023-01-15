const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const sharp = require("sharp");
const multer = require("multer");
const port = 3000;
const password = fs.readFileSync("./.env.txt", "utf-8").toString();
const { MongoClient } = require("mongodb");
var spotstList;
const uploadBaseUrl = `127.0.0.1:${port}/`;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const url = `mongodb+srv://sampleGoat:${password}@cluster0.6vhvr.mongodb.net/?retryWrites=true&w=majority`;
const mongoConfig = { useNewUrlParser: true, useUnifiedTopology: true };

const multerConfig = {
  limits: {
    fileSize: 1000000
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|jfif)$/)) {
      return cb(new Error('Please upload a valid image file'))
    }
    cb(undefined, true)
  }
}

async function queryAll() {
  const client = new MongoClient(url, mongoConfig);
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
// queryAll().catch(console.dir);

app.use('/public', express.static('public'));

//TODO this serves images to validate
app.use('/uploads', express.static('uploads'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
})

app.get('/upload.html', (request, response) => {
  response.sendFile(__dirname + '/public/upload.html');
})

app.get('/views/spots.ejs', (request, response) => {
  // MongoClient.connect(url, (err, db) => {
  //   if (err) throw err;
  //   var dbo = db.db("spotsDB");
  //   var query = {};
  //   dbo.collection("studyspots").find(query).toArray(function (err, result) {
  //     if (err) throw err;
  //     console.log(result);
  //     db.close();
  //     response.render('spots', { spotList: result });
  //   });
  // });
  list = [1, 2, 3, 4, 5];
  response.render('spots', { list: list });
});

app.post('/upload.html', multer(multerConfig).single("photo"), async (req, res) => {
  const client = new MongoClient(url, mongoConfig);
  let photoName = `photo-${Date.now()}`;
  try {
    const database = client.db('spotsDB');
    const studyspots = database.collection('studyspots');
    await sharp(req.file.buffer).jpeg().toFile(__dirname + `/uploads/` + photoName);
    const b64Image = fs.readFileSync(path.join(__dirname + '/uploads/' + photoName)).toString('base64');

    const newCollection = {
      location: req.body.location,
      area: req.body.area,
      rating: req.body.rating,
      description: req.body.description,
      img: b64Image
    }

    studyspots.insertOne(newCollection)
    res.redirect('/');

  } finally {
    await client.close();
    fs.unlink(__dirname + `/uploads/` + photoName, (err) => {
      if (err) {
          throw err;
      }
  
      console.log("Deleted File successfully.");
  });
  }
})

app.get('*', function (req, res) {
  res.send('No valid route found', 404);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})