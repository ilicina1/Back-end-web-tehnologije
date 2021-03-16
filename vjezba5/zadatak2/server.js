const express = require("express");
const app = express();
var mysql = require("mysql");

app.get("/imenik", function (req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "baza",
  });

  con.connect(function (err) {
    if (err) throw err;
    con.query("SELECT * FROM imenik", function (err, result, fields) {
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
  //res.end();
});

app.listen(3000);
