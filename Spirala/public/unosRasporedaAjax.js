$(document).ready(function () {
  var xhttp = new XMLHttpRequest();
  var objekat;
  xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
      objekat = JSON.parse(this.responseText);
    }
  };
  xhttp.open("GET", "http://localhost:8000/v1/predmeti", true);
  xhttp.send();

  // process the form
  $("form").on("submit", function (event) {
    var nazivPredmeta = $("input[name=nazivPredmeta]").val();
    var aktivnost = $("input[name=aktivnost]").val();
    var dan = $("input[name=dan]").val();
    var vrijemePocetka = $("input[name=vrijemePocetka]").val();
    var vrijemeKraja = $("input[name=vrijemeKraja]").val();

    var isti = false;
    for (var i of objekat) {
      if (i.nazivPredmeta == nazivPredmeta) isti = true;
    }

    var formData = {
      nazivPredmeta: nazivPredmeta,
      aktivnost: aktivnost,
      dan: dan,
      vrijemePocetka: vrijemePocetka,
      vrijemeKraja: vrijemeKraja,
    };

    event.preventDefault();

    // submit the form via Ajax
    if (
      nazivPredmeta.length != 0 &&
      aktivnost.length != 0 &&
      dan.length != 0 &&
      vrijemePocetka.length != 0 &&
      vrijemeKraja.length != 0
    ) {
      if (isti == true) {
        //kada vec postoji predmet saom postavljamo novu aktivnost
        $.ajax({
          url: "http://localhost:8000/v1/raspored",
          type: "POST",
          data: formData,
          success: function (result) {
            if (!result) alert("Dodana aktivnost");
          },
        });
      } else {
        $.ajax({
          url: "http://localhost:8000/v1/raspored",
          type: "POST",
          data: formData,
          success: function (result) {
            $.ajax({
              url: "http://localhost:8000/v1/predmeti",
              type: "POST",
              data: formData.nazivPredmeta,
              success: function (result) {
                if (!result) alert("Dodana aktivnost i predmet");
              },
            });
          },
        });
      }
    }
  });
});
