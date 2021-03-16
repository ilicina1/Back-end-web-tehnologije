function getStudente() {
  var objekat;
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      objekat = JSON.parse(this.responseText);
      provjeriKojiPostoje(objekat);
    } else if (this.readyState == 4) {
      console.log("Greška!");
    }
  };

  xhttp.open("GET", "http://localhost:8000/v2/student", true);

  xhttp.send();
}

function provjeriKojiPostoje(postojeciStudenti) {
  var textarea = document.getElementById("unesiStudente").value;
  var redovi = textarea.split("\n");
  var objekat = [];

  for (var i of redovi) {
    var pom = i.split(",");
    objekat.push({ ime: pom[0], index: pom[1] });
  }

  var objekatFinal = [];
  var objektiSaIstimIndexom = [];

  for (var i of objekat) {
    var postoji = false;
    for (var j of postojeciStudenti) {
      if (i.ime == j.ime && i.index == j.index) {
        postoji = true;
        break;
      } else if (i.index == j.index) {
        objektiSaIstimIndexom.push({
          ime1: i.ime,
          ime2: j.ime,
          index: j.index,
        });
        postoji = true;
      }
    }
    if (!postoji) objekatFinal.push(i);
  }

  for (var i of objektiSaIstimIndexom) {
    console.log(
      "Student " +
        i.ime1 +
        " nije kreiran jer postoji student " +
        i.ime2 +
        " sa istim indexom " +
        i.index
    );

    document.getElementById("unesiStudente").value =
      "Student " +
      i.ime1 +
      " nije kreiran jer postoji student " +
      i.ime2 +
      " sa istim indexom " +
      i.index;
  }

  for (var i of objekatFinal) {
    dodajStudente(i);
  }
}

function dodajStudente(student) {
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      document.getElementById("unesiStudente").value = this.responseText;
    }
  };

  xhttp.open(
    "POST",
    "http://localhost:8000/v2/student/?ime=" +
      student.ime +
      "&index=" +
      student.index,
    true
  );

  xhttp.send();
}
