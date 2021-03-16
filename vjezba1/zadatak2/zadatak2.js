const http = require("http");
const url = require("url");
const fs = require("fs");
const csvFilePath = "./imenik.txt";
const csv = require("csvtojson");

http
  .createServer(function (req, res) {
    if (req.method == "GET") {
      // new URL object
      let strUrl = "http://localhost:8080";

      let paramQ = req.url;
      if (!paramQ.includes("fav")) {
        strUrl += paramQ;
        let current_url = new URL(strUrl);

        // get access to URLSearchParams object
        const search_params = current_url.searchParams;

        // get url parameters
        const q = search_params.get("q");

        // Vracamo jsonObjekat a ispisujemo kroz konzolu one koji sadrze q parametar (tako sam shvatio zadatak);
        csv()
          .fromFile(csvFilePath)
          .then((jsonObj) => {
            // U jsonElements ubacujemo string verziju json objekta;
            const jsonElements = JSON.stringify(jsonObj);
            var obj = JSON.parse(jsonElements);

            // Pravimo niz objekata kako bi mogli ispisati;
            var resArray = [];
            for (var i in obj) resArray.push(obj[i]);
            
            // Ispisujemo one koji sadrze q parametar u imenu;
            for (var i = 0; i < resArray.length; i++) {
              if (resArray[i].Ime.toLowerCase().includes(q.toLowerCase()))
                console.log(
                  resArray[i].Ime +
                    ", " +
                    resArray[i].Prezime +
                    ", " +
                    resArray[i].Adresa +
                    ", " +
                    resArray[i].Brojtelefona
                );
            }
            res.end(jsonElements);
          });
      }
    }
  })
  .listen(8080);
