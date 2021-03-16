$(document).ready(function () {
  ucitajSortirano(null, null, callBackFunkcija);

  $("select").on("change", function () {
    var dani = document.getElementById("daniSedmica").value;
    if (dani == "sviDani") dani = null;
    ucitajSortirano(dani, null, callBackFunkcija);
  });

  $("th").click(function () {
    var dani = document.getElementById("daniSedmica").value;
    if (dani == "sviDani") dani = null;

    if (document.getElementById(this.id).classList.contains("asc")) {
      ucitajSortirano(dani, "A" + this.id, callBackFunkcija);

      $("#" + this.id).removeClass();
      $("#" + this.id).toggleClass("desc");

      if (
        document.getElementById("nazivPredmeta").classList.contains("desc") &&
        this.id != "nazivPredmeta"
      ) {
        $("#nazivPredmeta").removeClass();
        $("#nazivPredmeta").toggleClass("asc");
      }
      if (
        document.getElementById("aktivnost").classList.contains("desc") &&
        this.id != "aktivnost"
      ) {
        $("#aktivnost").removeClass();
        $("#aktivnost").toggleClass("asc");
      }
      if (
        document.getElementById("dan").classList.contains("desc") &&
        this.id != "dan"
      ) {
        $("#dan").removeClass();
        $("#dan").toggleClass("asc");
      }
      if (
        document.getElementById("vrijemePocetka").classList.contains("desc") &&
        this.id != "vrijemePocetka"
      ) {
        $("#vrijemePocetka").removeClass();
        $("#vrijemePocetka").toggleClass("asc");
      }
      if (
        document.getElementById("vrijemeKraja").classList.contains("desc") &&
        this.id != "vrijemeKraja"
      ) {
        $("#vrijemeKraja").removeClass();
        $("#vrijemeKraja").toggleClass("asc");
      }
    } else {
      ucitajSortirano(dani, "D" + this.id, callBackFunkcija);

      $("#" + this.id).removeClass();
      $("#" + this.id).toggleClass("asc");

      if (
        document.getElementById("nazivPredmeta").classList.contains("asc") &&
        this.id != "nazivPredmeta"
      ) {
        $("#nazivPredmeta").removeClass();
        $("#nazivPredmeta").toggleClass("desc");
      }
      if (
        document.getElementById("aktivnost").classList.contains("asc") &&
        this.id != "aktivnost"
      ) {
        $("#aktivnost").removeClass();
        $("#aktivnost").toggleClass("desc");
      }
      if (
        document.getElementById("dan").classList.contains("asc") &&
        this.id != "dan"
      ) {
        $("#dan").removeClass();
        $("#dan").toggleClass("desc");
      }
      if (
        document.getElementById("vrijemePocetka").classList.contains("asc") &&
        this.id != "vrijemePocetka"
      ) {
        $("#vrijemePocetka").removeClass();
        $("#vrijemePocetka").toggleClass("desc");
      }
      if (
        document.getElementById("vrijemeKraja").classList.contains("asc") &&
        this.id != "vrijemeKraja"
      ) {
        $("#vrijemeKraja").removeClass();
        $("#vrijemeKraja").toggleClass("desc");
      }
    }
  });
});
