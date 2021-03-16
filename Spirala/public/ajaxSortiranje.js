function callBackFunkcija(data, error) {
  if (!error) {
    $("#bodyTable").find("tr").remove();
    for (var i of data) {
      $("#bodyTable").append(
        "<tr>" +
          "<td>" +
          i.nazivPredmeta +
          "</td>" +
          "<td>" +
          i.aktivnost +
          "</td>" +
          "<td>" +
          i.dan +
          "</td>" +
          "<td>" +
          i.vrijemePocetka +
          "</td>" +
          "<td>" +
          i.vrijemeKraja +
          "</td>"
      );
    }
  } else console.log(error);
}

function ucitajSortirano(dan, atribut, callback) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      var objekat = JSON.parse(this.responseText);
      callback(objekat, null);
    } else if (this.readyState == 4) {
      callback(null, "Greska");
    }
  };

  if (
    (dan == null || dan.length == 0) &&
    (atribut == null || atribut.length == 0)
  )
    xhttp.open("GET", "http://localhost:8000/v1", true);
  else if (atribut == null || atribut.length == 0)
    xhttp.open("GET", "http://localhost:8000/v1/?dan=" + dan, true);
  else if (dan == null || dan.length == 0)
    xhttp.open("GET", "http://localhost:8000/v1/?sort=" + atribut, true);
  else
    xhttp.open(
      "GET",
      "http://localhost:8000/v1/?dan=" + dan + "&sort=" + atribut,
      true
    );

  xhttp.send();
}
