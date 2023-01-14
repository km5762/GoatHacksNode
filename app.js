const express = require('express')
const app = express();
const path = require('path');
const fs = require('fs');
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const port = 3000;

//serve static pages. index and upload will stay as is. spots will be dynamic from server
app.use(express.static('static'));
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

const Note = mongoose.model("Note", schema);
app.use(bodyParser.urlencoded({extended: true}));

//running
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})