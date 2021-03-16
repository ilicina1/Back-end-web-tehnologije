let http = require("http");
let fs = require("fs");
let url = require("url");
const ObjectsToCsv = require("objects-to-csv");

const server = http
  .createServer(function (req, res) {
    if (req.method == "DELETE") {
      fs.writeFile("knjige.txt", "", function () {
        res.end(
          fs.readFile("knjige.txt", "utf8", function (err, data) {
            if (err) {
              return console.log(err);
            }
            console.log(data);
          })
        );
      });
    }
    if (req.method == "PUT") {
      fs.readFile("knjige.txt", function (err, data) {
        let niz = [];
        let tekst = data.toString();
        let redovi = tekst.split("\n");
        for (let i = 0; i < redovi.length; i++) {
          let kolone = redovi[i].split(",");
          let objekat = {
            naslov: kolone[0],
            cijena: kolone[1],
            tip: kolone[2],
            ocjena: kolone[3],
          };
          niz.push(objekat);
        }
        niz[0].naslov = "blablaNoviNaslov";
        (async () => {
          const csv = new ObjectsToCsv(niz)
          
          // Save to file:
          await csv.toDisk("./knjige.txt");
        })();
        res.end(JSON.stringify(niz));
      });
    }
    if (req.method == "GET") {
      fs.readFile("knjige.txt", function (err, data) {
        let niz = [];
        let tekst = data.toString();
        let redovi = tekst.split("\n");
        for (let i = 0; i < redovi.length; i++) {
          let kolone = redovi[i].split(",");
          let objekat = {
            naslov: kolone[0],
            cijena: kolone[1],
            tip: kolone[2],
            ocjena: kolone[3],
          };
          niz.push(objekat);
        }
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(niz));
      });
    }

    if (req.method == "POST") {
      let tijeloZahtjeva = "";
      req.on("data", function (data) {
        tijeloZahtjeva += data;
      });

      req.on("end", function () {
        let parametri = new url.URLSearchParams(tijeloZahtjeva);
        let novaLinija = "";

        novaLinija +=
          "\n" +
          parametri.get("naslov") +
          "," +
          parametri.get("cijena") +
          "," +
          parametri.get("tip") +
          "," +
          parametri.get("ocjena");

        fs.appendFile("knjige.txt", novaLinija, function (err) {
          if (err) throw err;
          console.log("Novi red uspjesno dodan!");
          res.writeHead(200, {});
          res.end(parametri.toString());
        });
      });
    }
  })
  .listen(8080);

module.exports = server;
