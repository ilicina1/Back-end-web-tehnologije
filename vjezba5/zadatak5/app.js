const express = require("express");
const app = express();
const bodyParser = require("body-parser");

var mysql = require("mysql");

// app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/poznanik/:kontakt", function (req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "baza",
  });

  var id = req.params;

  con.connect(function (err) {
    if (err) throw err;
    con.query(`SELECT i.ime, i.prezime, i.adresa, i.broj_telefona FROM imenik i, adresar a WHERE a.idKontakt = '${id.kontakt}' AND a.idPoznanik = i.id`, function (err, result, fields) {
      if (err) throw err;
      let tabela = "<table style='border: 1px solid black'><tr><th>ime</th><th>prezime</th><th>adresa</th><th>broj telefona</th></tr>";
      Object.keys(result).forEach(function (key) {
        var row = result[key];
        tabela +=
          "<tr><td>" +
          row.ime +
          "</td><td>" +
          row.prezime +
          "</td><td>" +
          row.adresa +
          "</td><td>" +
          row.broj_telefona +
          "</td></tr>";
      });
      tabela += "</table>";
      res.send(tabela);
    });
    con.end();
  });
});

app.listen(3000);
