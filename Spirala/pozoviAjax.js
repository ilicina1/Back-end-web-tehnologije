$(document).ready(function () {
    // ucitajSortirano(null, null, callBackFunkcija);
  
    $("#button").on("click", function (e) {
      e.preventDefault();
      e.stopPropagation(); // only neccessary if something above is listening to the (default-)event too
      getStudente();
    });
    


  });
  