const http = require("http");
const csv = require("csv-parser");
const fs = require("fs");
const csv2 = require("csvtojson");
const results = [];
var qs = require("querystring");
const ObjectsToCsv = require("objects-to-csv");
const express = require("express");
const app = express();
const Sequelize = require("sequelize");
const sequelize = require("./baza.js");

const Predmet = require(__dirname + "/models/predmet.js")(
  sequelize,
  Sequelize.DataTypes
);

const Grupa = require(__dirname + "/models/grupa.js")(
  sequelize,
  Sequelize.DataTypes
);

const Aktivnost = require(__dirname + "/models/aktivnost.js")(
  sequelize,
  Sequelize.DataTypes
);

const Tip = require(__dirname + "/models/tip.js")(
  sequelize,
  Sequelize.DataTypes
);

const Student = require(__dirname + "/models/student.js")(
  sequelize,
  Sequelize.DataTypes
);

const Dan = require(__dirname + "/models/dan.js")(
  sequelize,
  Sequelize.DataTypes
);

Predmet.hasMany(Grupa, { as: "grupa" }); // 1-N
Predmet.hasMany(Aktivnost, { as: "predmet" }); // 1-N
Aktivnost.hasMany(Grupa, { as: "aktivnost" }); // 1-0 ali je na pitanja odgovoreno da stavimo kao 1 na više
Dan.hasMany(Aktivnost, { as: "dan" }); // 1-N
Tip.hasMany(Aktivnost, { as: "tip" }); // 1-N

Student.belongsToMany(Grupa, { through: "studentGrupa" }); // N-M
Grupa.belongsToMany(Student, { through: "studentGrupa" }); // N-M

sequelize.sync({ force: false });

// Predmet.sync({ force: false });
// Grupa.sync({ force: false });
// Student.sync({ force: true });
// Dan.sync({ force: true });
// Tip.sync({ force: true });
// Aktivnost.sync({ force: true });

app.use(express.static("public"));
app.use(express.static(__dirname));

app.get("/v1/unosRasporeda", function (req, res) {
  res.sendFile(__dirname + "/public/" + "unosRasporeda.html");
});

app.get("/v1/pregledAktivnosti", function (req, res) {
  res.sendFile(__dirname + "/public/" + "pregledAktivnosti.html");
});

app.get("/v2/studenti", function (req, res) {
  res.sendFile(__dirname + "/studenti.html");
});

app.get("/v1/predmeti", function (req, res) {
  try {
    if (!fs.existsSync("raspored.csv")) {
      var obj = new Object();
      obj.greska = "Datoteka raspored.csv nije kreirana!";
      res.end(JSON.stringify(obj));
    }
  } catch (err) {
    console.error(err);
  }
  fs.readFile("predmeti.txt", "utf8", function (err, data) {
    if (err) throw err;
    var array = data.split("\n");
    var objekat = [];
    for (var i of array) objekat.push({ nazivPredmeta: i });
    res.end(JSON.stringify(objekat));
  });
});

app.post("/v1/predmeti", function (req, res) {
  var body = "";
  //sacuvamo sacuvane podatke u  var body
  req.on("data", function (data) {
    body += data;
    if (body.length > 1e6) request.connection.destroy();
  });
  var post;
  // imamo sada kao objekat post
  req.on("end", function () {
    var array;
    try {
      fs.readFile("predmeti.txt", "utf8", function (err, data) {
        if (err) throw err;
        array = data.split("\n");
        post = qs.parse(body);
        var jes = false;
        for (var i of array) {
          if (i == post.nazivPredmeta) {
            res.end(console.log("Naziv predmeta vec postoji!"));
            jes = true;
            break;
          }
        }
        if (!jes) {
          const CreateFiles = fs.createWriteStream("predmeti.txt", {
            flags: "a", //flags: 'a' cuva stare podatke i nadogradjujemo
          });
          CreateFiles.write("\n" + post.nazivPredmeta);
          res.end(console.log("Uspjesno dodan predmet!"));
        }
      });
    } catch (e) {
      console.log("Error:", e.stack);
    }
  });
});

app.post("/v1/raspored", function (req, res) {
  var body = "";
  //sacuvamo sacuvane podatke u  var body
  req.on("data", function (data) {
    body += data;
    if (body.length > 1e6) request.connection.destroy();
  });
  var post;

  Aktivnost.findAll()
    .then((aktivnosti) => {
      post = qs.parse(body);
      for (var i of aktivnosti) {
        var predmetFind = Predmet.findByPk(i.PredmetId)
          .then((predmet) => {
            predmetFind = predmet;
          })
          .catch((err) => console.log(err));

        var danFind = Dan.findByPk(i.DanId)
          .then((dan) => {
            danFind = dan;
          })
          .catch((err) => console.log(err));

        if (
          predmetFind.naziv == post.nazivPredmeta &&
          i.naziv == post.aktivnost &&
          danFind == post.dan &&
          i.pocetak == post.vrijemePocetka &&
          i.kraj == post.vrijemeKraja
        )
          temp = true;
      }

      if (temp) res.end(console.log("Greska, ovi podaci vec postoje!"));
      else {
        Predmet.findOrCreate({
          where: { naziv: post.nazivPredmeta },
        });

        var predmetic = Predmet.findAll({
          where: { naziv: post.nazivPredmeta },
        });

        Dan.findOrCreate({
          where: { naziv: post.naziv },
        });

        var danic = Dan.findAll({
          where: { naziv: post.dan },
        });

        Aktivnost.sync({ force: false }).then(function () {
          // Table created
          return Aktivnost.create({
            naziv: naziv,
            pocetak: post.vrijemePocetka,
            kraj: vrijemeKraja,
            PredmetId: predmetic.id,
            DanId: danic.id,
          });
          res.end(console.log("Aktivnost uspjesno dodana!"));
        });
      }
    })
    .catch((err) => console.log(err));

  // imamo sada kao objekat post
  req.on("end", function () {
    post = qs.parse(body);
    fs.createReadStream("raspored.csv")
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => {
        var temp = false;
        for (var i of results) {
          if (
            i.nazivPredmeta == post.nazivPredmeta &&
            i.aktivnost == post.aktivnost &&
            i.dan == post.dan &&
            i.vrijemePocetka == post.vrijemePocetka &&
            i.vrijemeKraja == post.vrijemeKraja
          )
            temp = true;
        }
        if (temp) res.end(console.log("Greska, ovi podaci vec postoje!"));
        else {
          const CreateFiles = fs.createWriteStream("raspored.csv", {
            flags: "a", //flags: 'a' cuva stare podatke i nadogradjujemo
          });
          CreateFiles.write(
            "\n" +
              post.nazivPredmeta +
              "," +
              post.aktivnost +
              "," +
              post.dan +
              "," +
              post.vrijemePocetka +
              "," +
              post.vrijemeKraja
          );
          res.end(console.log("Aktivnost uspjesno dodana!"));
        }
      });
  });
});

app.get("/v1", function (req, res) {
  try {
    if (!fs.existsSync("raspored.csv")) {
      var obj = new Object();
      obj.greska = "Datoteka raspored.csv nije kreirana!";
      res.end(JSON.stringify(obj));
    }
  } catch (err) {
    console.error(err);
  }

  csv2()
    .fromFile("raspored.csv")
    .then((jsonObj) => {
      const jsonElements = JSON.stringify(jsonObj);
      var myHeaders = req.headers;
      // new URL object
      let strUrl = "http://localhost:8000";

      let paramQ = req.url;
      strUrl += paramQ;
      let current_url = new URL(strUrl);

      // get access to URLSearchParams object
      const search_params = current_url.searchParams;

      // get url parameters
      const q = search_params.get("dan");
      const sort = search_params.get("sort");
      var sortNew = "";
      //Kod mene su atribut nazivPredmeta, aktivnost, dan, vrijemePocetka, vrijemeKraja i tako podrazumijevam da ce se slati kao sort value!
      // true for asc, false for dec
      var ascOrDec = false;
      //nitijedno ako je true znaci da sort atribut ne valja.
      var nitiJedno = false;
      if (sort != null) {
        if (sort[0] == "A") ascOrDec = true;
        else if (sort[0] == "D") ascOrDec = false;
        else nitiJedno = true;

        sortNew = sort.substring(1);
        if (
          sortNew != "nazivPredmeta" &&
          sortNew != "aktivnost" &&
          sortNew != "dan" &&
          sortNew != "vrijemePocetka" &&
          sortNew != "vrijemeKraja"
        )
          nitiJedno = true;
      } else {
        nitiJedno = true;
      }

      if (myHeaders.accept == "text/csv") {
        if (q != null) {
          var pom = new Array();
          for (var i = 0; i < jsonObj.length; i++) {
            var objekk = new Object();
            if (jsonObj[i].dan == q) {
              objekk = jsonObj[i];
              pom.push(objekk);
            }
          }
          if (nitiJedno == true) {
            (async () => {
              const csv33 = new ObjectsToCsv(pom);
              // Return the CSV file as string:
              res.end(await csv33.toString());
            })();
          } else {
            if (ascOrDec) {
              if (sortNew != "vrijemePocetka" && sortNew != "vrijemeKraja") {
                pom.sort((a, b) => (a[sortNew] > b[sortNew] ? 1 : -1));
              } else {
                pom.sort((a, b) =>
                  new Date("1/1/1999 " + a[sortNew]) >
                  new Date("1/1/1999 " + b[sortNew])
                    ? 1
                    : -1
                );
              }
            } else {
              if (sortNew != "vrijemePocetka" && sortNew != "vrijemeKraja") {
                pom.sort((a, b) => (a[sortNew] > b[sortNew] ? -1 : 1));
              } else {
                pom.sort((a, b) =>
                  new Date("1/1/1999 " + a[sortNew]) >
                  new Date("1/1/1999 " + b[sortNew])
                    ? -1
                    : 1
                );
              }
            }
            (async () => {
              const csv33 = new ObjectsToCsv(pom);
              // Return the CSV file as string:
              res.end(await csv33.toString());
            })();
          }
        } else {
          if (nitiJedno == true) {
            fs.readFile("raspored.csv", "utf8", function (err, data) {
              if (err) throw err;
              res.end(data);
            });
          } else {
            if (ascOrDec) {
              if (sortNew != "vrijemePocetka" && sortNew != "vrijemeKraja") {
                jsonObj.sort((a, b) => (a[sortNew] > b[sortNew] ? 1 : -1));
              } else {
                jsonObj.sort((a, b) =>
                  new Date("1/1/1999 " + a[sortNew]) >
                  new Date("1/1/1999 " + b[sortNew])
                    ? 1
                    : -1
                );
              }
            } else {
              if (sortNew != "vrijemePocetka" && sortNew != "vrijemeKraja") {
                jsonObj.sort((a, b) => (a[sortNew] > b[sortNew] ? -1 : 1));
              } else {
                jsonObj.sort((a, b) =>
                  new Date("1/1/1999 " + a[sortNew]) >
                  new Date("1/1/1999 " + b[sortNew])
                    ? -1
                    : 1
                );
              }
            }
            (async () => {
              const csv33 = new ObjectsToCsv(jsonObj);
              // Return the CSV file as string:
              res.end(await csv33.toString());
            })();
          }
        }
      } else {
        // kad se vraca json objekat
        if (q != null) {
          var pom = new Array();
          for (var i = 0; i < jsonObj.length; i++) {
            var objekk = new Object();
            if (jsonObj[i].dan == q) {
              objekk = jsonObj[i];
              pom.push(objekk);
            }
          }
          if (nitiJedno == true) {
            res.end(JSON.stringify(pom));
          } else {
            if (ascOrDec) {
              if (sortNew != "vrijemePocetka" && sortNew != "vrijemeKraja") {
                pom.sort((a, b) => (a[sortNew] > b[sortNew] ? 1 : -1));
              } else {
                pom.sort((a, b) =>
                  new Date("1/1/1999 " + a[sortNew]) >
                  new Date("1/1/1999 " + b[sortNew])
                    ? 1
                    : -1
                );
              }
            } else {
              if (sortNew != "vrijemePocetka" && sortNew != "vrijemeKraja") {
                pom.sort((a, b) => (a[sortNew] > b[sortNew] ? -1 : 1));
              } else {
                pom.sort((a, b) =>
                  new Date("1/1/1999 " + a[sortNew]) >
                  new Date("1/1/1999 " + b[sortNew])
                    ? -1
                    : 1
                );
              }
            }
            res.end(JSON.stringify(pom));
          }
        } else {
          if (nitiJedno == true) {
            res.end(JSON.stringify(jsonObj));
          } else {
            if (ascOrDec) {
              if (sortNew != "vrijemePocetka" && sortNew != "vrijemeKraja") {
                jsonObj.sort((a, b) => (a[sortNew] > b[sortNew] ? 1 : -1));
              } else {
                jsonObj.sort((a, b) =>
                  new Date("1/1/1999 " + a[sortNew]) >
                  new Date("1/1/1999 " + b[sortNew])
                    ? 1
                    : -1
                );
              }
            } else {
              if (sortNew != "vrijemePocetka" && sortNew != "vrijemeKraja") {
                jsonObj.sort((a, b) => (a[sortNew] > b[sortNew] ? -1 : 1));
              } else {
                jsonObj.sort((a, b) =>
                  new Date("1/1/1999 " + a[sortNew]) >
                  new Date("1/1/1999 " + b[sortNew])
                    ? -1
                    : 1
                );
              }
            }
            res.end(JSON.stringify(jsonObj));
          }
        }
      }
    });
});

// CRUD operacije za spiralu 4

// CRUD operacije za model "Predmet"
app.get("/v2/predmet", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");
  if (id != null) {
    Predmet.findByPk(id)
      .then((predmet) => {
        res.send(predmet);
      })
      .catch((err) => console.log(err));
  } else {
    Predmet.findAll()
      .then((predmeti) => {
        res.send(predmeti);
      })
      .catch((err) => console.log(err));
  }
});

app.post("/v2/predmet", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const naziv = search_params.get("naziv");

  Predmet.findAll()
    .then((predmeti) => {
      var pom = false;
      for (var i of predmeti) {
        if (i.naziv == naziv) {
          pom = true;
          break;
        }
      }
      if (!pom) {
        Predmet.sync({ force: false }).then(function () {
          // Table created
          return Predmet.create({
            naziv: naziv,
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

app.put("/v2/predmet", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");
  const naziv = search_params.get("naziv");

  Predmet.findByPk(id)
    .then((predmet) => {
      predmet.naziv = naziv;
      predmet.save();
      console.log(predmet.naziv);
    })
    .catch((err) => console.log(err));
});

app.delete("/v2/predmet", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");

  Predmet.destroy({
    where: {
      id: id,
    },
  });
});

// CRUD operacije za model "Grupa"
app.get("/v2/grupa", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");
  if (id != null) {
    Grupa.findByPk(id)
      .then((grupa) => {
        res.send(grupa);
      })
      .catch((err) => console.log(err));
  } else {
    Grupa.findAll()
      .then((grupe) => {
        console.log(grupe);
        res.send(grupe);
      })
      .catch((err) => console.log(err));
  }
});

app.post("/v2/grupa", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const naziv = search_params.get("naziv");

  Grupa.findAll()
    .then((grupe) => {
      var pom = false;
      for (var i of grupe) {
        if (i.naziv == naziv) {
          pom = true;
          break;
        }
      }
      if (!pom) {
        Grupa.sync({ force: false }).then(function () {
          // Table created
          return Grupa.create({
            naziv: naziv,
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

app.put("/v2/grupa", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");
  const naziv = search_params.get("naziv");

  Grupa.findByPk(id)
    .then((grupa) => {
      grupa.naziv = naziv;
      grupa.save();
    })
    .catch((err) => console.log(err));
});

app.delete("/v2/grupa", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");

  Grupa.destroy({
    where: {
      id: id,
    },
  });
});

// CRUD operacije za model "Dan"
app.get("/v2/dan", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");
  if (id != null) {
    Dan.findByPk(id)
      .then((dan) => {
        res.send(dan);
      })
      .catch((err) => console.log(err));
  } else {
    Dan.findAll()
      .then((dani) => {
        res.send(dani);
      })
      .catch((err) => console.log(err));
  }
});

app.post("/v2/dan", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const naziv = search_params.get("naziv");

  Dan.findAll()
    .then((dani) => {
      var pom = false;
      for (var i of dani) {
        if (i.naziv == naziv) {
          pom = true;
          break;
        }
      }
      if (!pom) {
        Dan.sync({ force: false }).then(function () {
          // Table created
          return Dan.create({
            naziv: naziv,
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

app.put("/v2/dan", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");
  const naziv = search_params.get("naziv");

  Dan.findByPk(id)
    .then((dan) => {
      dan.naziv = naziv;
      dan.save();
    })
    .catch((err) => console.log(err));
});

app.delete("/v2/dan", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");

  Dan.destroy({
    where: {
      id: id,
    },
  });
});

// CRUD operacije za model "Tip"
app.get("/v2/tip", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");
  if (id != null) {
    Tip.findByPk(id)
      .then((tip) => {
        res.send(tip);
      })
      .catch((err) => console.log(err));
  } else {
    Tip.findAll()
      .then((tipovi) => {
        res.send(tipovi);
      })
      .catch((err) => console.log(err));
  }
});

app.post("/v2/tip", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const naziv = search_params.get("naziv");

  Tip.findAll()
    .then((tipovi) => {
      var pom = false;
      for (var i of tipovi) {
        if (i.naziv == naziv) {
          pom = true;
          break;
        }
      }
      if (!pom) {
        Tip.sync({ force: false }).then(function () {
          // Table created
          return Tip.create({
            naziv: naziv,
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

app.put("/v2/tip", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");
  const naziv = search_params.get("naziv");

  Tip.findByPk(id)
    .then((tip) => {
      tip.naziv = naziv;
      tip.save();
    })
    .catch((err) => console.log(err));
});

app.delete("/v2/tip", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");

  Tip.destroy({
    where: {
      id: id,
    },
  });
});

// CRUD operacije za model "Student"
app.get("/v2/student", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");
  if (id != null) {
    Student.findByPk(id)
      .then((student) => {
        res.send(student);
      })
      .catch((err) => console.log(err));
  } else {
    Student.findAll()
      .then((studenti) => {
        res.send(studenti);
      })
      .catch((err) => console.log(err));
  }
});

app.post("/v2/student", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const ime = search_params.get("ime");
  const index = search_params.get("index");

  Student.findAll()
    .then((studenti) => {
      var pom = false;
      for (var i of studenti) {
        if ((i.ime == ime && i.index == index) || i.index == index) {
          pom = true;
          break;
        }
      }
      if (!pom) {
        console.log("SSSSS")
        Student.sync({ force: false }).then(function () {
          // Table created
          return Student.create({
            ime: ime,
            index: index,
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

app.put("/v2/student", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");
  const ime = search_params.get("ime");
  const index = search_params.get("index");

  Student.findByPk(id)
    .then((student) => {
      student.ime = ime;
      student.index = index;
      student.save();
    })
    .catch((err) => console.log(err));
});

app.delete("/v2/student", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");

  Student.destroy({
    where: {
      id: id,
    },
  });
});

// CRUD operacije za model "Aktivnost"
app.get("/v2/aktivnost", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");
  if (id != null) {
    Aktivnost.findByPk(id)
      .then((aktivnost) => {
        res.send(aktivnost);
      })
      .catch((err) => console.log(err));
  } else {
    Aktivnost.findAll()
      .then((aktivnosti) => {
        res.send(aktivnosti);
      })
      .catch((err) => console.log(err));
  }
});

app.post("/v2/aktivnost", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const naziv = search_params.get("naziv");
  const pocetak = search_params.get("pocetak");
  const kraj = search_params.get("kraj");

  Aktivnost.findAll()
    .then((aktivnosti) => {
      var pom = false;
      for (var i of aktivnosti) {
        if (i.naziv == naziv && i.pocetak == pocetak && i.kraj == kraj) {
          pom = true;
          break;
        }
      }
      if (!pom) {
        Aktivnost.sync({ force: false }).then(function () {
          // Table created
          return Aktivnost.create({
            naziv: naziv,
            pocetak: pocetak,
            kraj: kraj,
          });
        });
      }
    })
    .catch((err) => console.log(err));
});

app.put("/v2/aktivnost", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const naziv = search_params.get("naziv");
  const pocetak = search_params.get("pocetak");
  const kraj = search_params.get("kraj");

  Aktivnost.findByPk(id)
    .then((aktivnost) => {
      aktivnost.naziv = naziv;
      aktivnost.pocetak = pocetak;
      aktivnost.kraj = kraj;
      aktivnost.save();
    })
    .catch((err) => console.log(err));
});

app.delete("/v2/aktivnost", function (req, res) {
  // new URL object
  let strUrl = "http://localhost:8000";

  let paramQ = req.url;
  strUrl += paramQ;
  let current_url = new URL(strUrl);

  // get access to URLSearchParams object
  const search_params = current_url.searchParams;

  // get url parameters
  const id = search_params.get("id");

  Aktivnost.destroy({
    where: {
      id: id,
    },
  });
});

app.listen(8000);
