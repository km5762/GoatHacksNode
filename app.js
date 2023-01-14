const express = require('express')
const path = require('path');
const fs = require('fs');
const mult = require("multiparty");
const app = express();
const port = 3000;
const uploadDir = `./uploads`;
const imgBaseUrl = `https://127.0.0.1:${port}/uploads/`;
var password = fs.readFileSync("./.env.txt", "utf-8");

//static page
// app.use(express.static(path.join(__dirname, 'static')));
// app.get("/", (req, res) => {
//   res.sendFile(path.join(__dirname, '/static/index.html'));
//   console.log("Home");
// });

// app.get("/static/spots", (req, res) => {
//   res.sendFile(path.join(__dirname, '/static/spots.html'));
//   console.log("spots");
// });

// app.get("/static/upload", (req, res) => {
//   res.sendFile(path.join(__dirname, '/static/upload.html'));
//   console.log("upload");
// });
app.use(express.static('static'));

app.post("/upload", (req, res) => {
  let form = new mult.Form({uploadDir: uploadDir})

  form.parse(req, function(err, fields, files) {
    if (err) return res.send({error : err.message})

    console.log(`fields = ${JSON.stringify(fields, null, 2)}`);
    console.log(`files = ${JSON.stringify(files, null, 2)}`);

    const imagePath = files.image[0].path;
    const imageFileName = imagePath.slice(imagePath.lastIndex("\\") + 1);
    const imageUrl = imgBaseUrl + imageFileName;
    console.log(imageUrl);
  })
});


//running
app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
})