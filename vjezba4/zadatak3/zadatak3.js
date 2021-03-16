const express = require("express");
// const bodyParser = require("body-parser");
// var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
const app = express();

app.use(express.static("public"));
app.get("/index.html", function (req, res) {
  res.sendFile(__dirname + "/public/" + "index.html");
});
app.get("/", function (req, res) {
    res.sendFile(__dirname + "/public/" + "index.html");
  });
app.listen(80);
