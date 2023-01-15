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
const uploadBaseUrl = `127.0.0.1:${port}/`;

app.set('views', './views');
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const url = `mongodb+srv://sampleGoat:${password}@cluster0.6vhvr.mongodb.net/?retryWrites=true&w=majority`;
const mongoConfig = { useNewUrlParser: true, useUnifiedTopology: true };

const multerConfig = {

  //specify diskStorage (another option is memory)
  storage: multer.diskStorage({

    //specify destination
    destination: function (req, file, next) {
      next(null, './uploads');
    },

    //specify the filename to be unique
    filename: function (req, file, next) {
      // console.log(file);
      //get the file mimetype ie 'image/jpeg' split and prefer the second value ie'jpeg'
      const ext = file.mimetype.split('/')[1];
      //set the file fieldname to a unique name containing the original name, current datetime and the extension.
      next(null, file.fieldname + '-' + Date.now() + '.' + ext);
    }
  }),

  // filter out and prevent non-image files.
  fileFilter: function (req, file, next) {
    if (!file) {
      next();
    }

    // only permit image mimetypes
    const image = file.mimetype.startsWith('image/');
    if (image) {
      console.log('photo uploaded');
      next(null, true);
    } else {
      console.log("file not supported")
      //TODO:  A better message response to user on failure.
      return next();
    }
  }
};

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

app.get('/views/spots.ejs', (request, response) => {
  MongoClient.connect(url, (err, db) => {
    if (err) throw err;
    var dbo = db.db("spotsDB");
    var query = {};
    dbo.collection("studyspots").find(query).toArray(function (err, result) {
      if (err) throw err;
      console.log(result);
      db.close();
      response.render('spots', { spotList: result });
    });
  });
});

app.post('/upload.html', multer(multerConfig).any(), async (req, res) => {
  const client = new MongoClient(url, mongoConfig);
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