const http = require("http");
var js2xmlparser = require("js2xmlparser");
const fs = require("fs");
var qs = require("querystring");

http
  .createServer(function (req, res) {
    if (req.method == "POST") {
      var objekat = new Object();
      var nizObjekata = new Array();

      fs.readFile("./users.csv", "utf8", function (err, data) {
        if (err) {
          return console.log(err);
        }
        var redovi = data.split("\n");
        for (var i of redovi) {
          var atributi = i.split(",");
          for (var j = 0; j < atributi.length; j++) {
            var naziv = atributi[j].split(":");
            if (j == 0) objekat.username = naziv[1];
            if (j == 1) {
              var prvaDvotacka = false;
              var string = "";
              for (var m = 0; m < atributi[j].length; m++) {
                if (prvaDvotacka) {
                  string += atributi[j][m];
                }
                if (atributi[j][m] == ":") prvaDvotacka = true;
              }
              objekat.password = string;
            }
            if (j == 2) objekat.name = naziv[1];
            if (j == 3) objekat.surname = naziv[1];
            if (j == 4) objekat.role = naziv[1];
          }
          nizObjekata.push(objekat);
          //Resetovanje objekta
          objekat = {};
        }

        var body = "";
        req.on("data", function (data) {
          body += data;
          if (body.length > 1e6) request.connection.destroy();
        });
        var post;
        req.on("end", function () {
          post = qs.parse(body);
          var newPassword = "";
          for (var i = 0; i < post.password.length; i++) {
            var broj = (post.password.charCodeAt(i) % 16) + 55;
            newPassword += String.fromCharCode(broj);
          }
          var pronadjen = false;
          var index = 0;
          for (var i = 0; i < nizObjekata.length; i++) {
            if (
              nizObjekata[i].username == post.username &&
              nizObjekata[i].password == newPassword
            ) {
              pronadjen = true;
              index = i;
            }
            if (!pronadjen)
              if (nizObjekata[i].username == post.username) index = i;
          }

          var xmlObj = new Object();
          var today = new Date();
          var date =
            today.getDate() +
            "-" +
            (today.getMonth() + 1) +
            "-" +
            today.getFullYear();
          var vrime =
            today.getHours() +
            ":" +
            today.getMinutes() +
            ":" +
            today.getSeconds();
          if (pronadjen) {
            var obj = {
              uspjesnaPrijava: "Uspjesna prijava",
              datumPrijave: date,
              vrijemePrijave: vrime,
              podaciKorisnika: {
                "@": {
                  type: "infos",
                },
                name: nizObjekata[index].name,
                surname: nizObjekata[index].surname,
                role: nizObjekata[index].role,
              },
            };
          } else {
            var obj = {
              uspjesnaPrijava: "Neuspjesna prijava",
              datumPrijave: date,
              vrijemePrijave: vrime,
              podaciKorisnika: {
                "@": {
                  type: "infos",
                },
                username: nizObjekata[index].username,
              },
            };
          }
          if (
            post.name.length < 1 &&
            post.surname.length < 1 &&
            post.role.length < 1
          ) {
            res.end(js2xmlparser.parse("User", obj));
          }else{
            var obj1 = new Object();
            if(post.username.length > 0) obj1.username = post.username;
            if(post.password.length > 0) obj1.password = post.password;
            if(post.name.length > 0) obj1.name = post.name;
            if(post.surname.length > 0) obj1.surname = post.surname;
            if(post.role.length > 0) obj1.role = post.role;
            res.end(JSON.stringify(obj1));
          }
        });
      });
    }
  })
  .listen(8080);
