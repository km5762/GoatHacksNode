const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs');
const ejs = require('ejs');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const ImageModel = require("./image.model");
const port = 3000;
const password = fs.readFileSync("./.env.txt", "utf-8").toString();
const { MongoClient } = require("mongodb");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');


// connect to mongoosedb
const uri = `mongodb+srv://sampleGoat:${password}@cluster0.6vhvr.mongodb.net/?retryWrites=true&w=majority`;


const Storage = multer.diskStorage({
  destination: "uploads",
  filename: (req, file, cb) => {
    cb(null, Date.now);
  }
});

const upload = multer({
  storage: Storage
}).single('testImage');

async function queryAll() {
  const client = new MongoClient(uri);
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

const Spot = mongoose.model("studyspots", schema);

app.use('/public', express.static('public'));

app.get('/', (request, response) => {
  response.sendFile(__dirname + '/public/index.html');
})

app.get('/upload.html', (request, response) => {
  response.sendFile(__dirname + '/public/upload.html');
})

app.get('/views/spots.ejs', (request, response) => {
  Spot.find({}, function (err, spots) {
    response.render('spots', {
      spotsList: spots
    })
  })
})

///form posting to mongo
app.post('/upload.html', async (req, res) => {
  const client = new MongoClient(uri);
  try {
    const database = client.db('spotsDB');
    const studyspots = database.collection('studyspots');

    const newCollection = {
      location: req.body.location,
      area: req.body.area,
      rating: req.body.rating,
      description: req.body.description,
      img: "hi"
    }

    studyspots.insertOne(newCollection)
    res.redirect('/');
  } finally {
    await client.close();
  }

})
// app.post('/upload.html', async (req, res) => {
//   let imageLoc = "HITHEREMYELS";
//   let newSpot = new Spot({
//     _id: mongoose.Types.ObjectId(),
//     location: req.body.location,
//     area: req.body.area,
//     rating: req.body.rating, //has to be computed to be average on view
//     description: req.body.description,
//     img: imageLoc
//   });
//   // console.log(req.body.location);
//   // console.log(req.body.area);
//   // console.log(req.body.rating);
//   // console.log(req.body.description);

//   await newSpot.save().then(console.log("Table updated!"));
//   res.redirect('/upload.html');

// }) 

//running
app.listen(port, function () {
  console.log(`Example app listening on port ${port}`);
})