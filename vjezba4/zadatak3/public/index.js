function loadDoc1() {
  var ajax = new XMLHttpRequest();
  ajax.onreadystatechange = function () {
    // Anonimna funkcija
    if (ajax.readyState == 4 && ajax.status == 200)
      document.getElementById("sadrzajStranice").innerHTML = ajax.responseText;
    if (ajax.readyState == 4 && ajax.status == 404)
      document.getElementById("sarzajStranice").innerHTML = "Greska: nepoznat URL";
  };
  ajax.open("GET", "stranica1.html", true);
  ajax.send();
}

function loadDoc2() {
  var ajax = new XMLHttpRequest();
  ajax.onreadystatechange = function () {
    // Anonimna funkcija
    if (ajax.readyState == 4 && ajax.status == 200)
      document.getElementById("sadrzajStranice").innerHTML = ajax.responseText;
    if (ajax.readyState == 4 && ajax.status == 404)
      document.getElementById("sarzajStranice").innerHTML = "Greska: nepoznat URL";
  };
  ajax.open("GET", "stranica2.html", true);
  ajax.send();
}

function loadDoc3() {
  var ajax = new XMLHttpRequest();
  ajax.onreadystatechange = function () {
    // Anonimna funkcija
    if (ajax.readyState == 4 && ajax.status == 200)
      document.getElementById("sadrzajStranice").innerHTML = ajax.responseText;
    if (ajax.readyState == 4 && ajax.status == 404)
      document.getElementById("sarzajStranice").innerHTML = "Greska: nepoznat URL";
  };
  ajax.open("GET", "stranica3.html", true);
  ajax.send();
}