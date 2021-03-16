const http = require("http");
const fs = require("fs");
const csvFilePath = "./imenik.txt";
const csv = require("csvtojson");

http
  .createServer(function (req, res) {
    if (req.method == "GET") {
      csv()
        .fromFile(csvFilePath)
        .then((jsonObj) => {
            res.end(JSON.stringify(jsonObj));
        });
    }
  })
  .listen(8080);
