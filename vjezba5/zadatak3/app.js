const express = require("express");
const app = express();
const bodyParser = require("body-parser");

var mysql = require("mysql");

app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Da bi se pristupilo formi potrebno je pokrenuti app js ("node app.js") te zatim pristupiti "localhost:3000/forma"

app.post("/", function (req, res) {
  var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "password",
    database: "baza",
  });

  con.connect(function (err) {
    if (err) throw err;
    let tijelo = req.body;

    var sql = `INSERT INTO imenik (ime, prezime, adresa, broj_telefona ) VALUES ('${tijelo.ime}', '${tijelo.prezime}', '${tijelo.adresa}', ${tijelo.brojTelefona} )`;
    con.query(sql, tijelo, function (err, data) {
      if (err) throw err;
      console.log("Uspjesno dodan red");
    });
    res.redirect("/");
  });
});

app.get("/forma", function (req, res) {
  res.sendFile(__dirname + "/public/" + "index.html");
});

app.listen(3000);
