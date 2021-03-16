$(document).ready(function () {
    var inputs = document.getElementsByTagName("input");
    $.validator.addMethod("custom_number", function(value, element) {
      return this.optional(element)  ||
          value.match(/^[0-9.]+$/);
  }, "Upisi u formatu HH.MM");
  
    $("form[name='unos']").validate({
      // Uslovi validacije
      rules: {
        nazivPredmeta: {
          required: true,
          minlength: 3,
        },
        aktivnost: {
          required: true,
          minlength: 3,
        },
        dan: {
          required: true,
          minlength: 5,
        },
        vrijemePocetka: {
          required: true,
          minlength: 5,
          maxlength:5,
          custom_number: true,
        },
        vrijemeKraja: {
          required: true,
          minlength: 5,
          custom_number: true,
          maxlength:5,
        },
      },
      // Poruke greski
      messages: {
        nazivPredmeta: {
          required: "Molimo vas da unesete naziv predmeta",
          minlength: "Morate unijeti minimalno 3 karaktera",
        },
        aktivnost:{
          required: "Molimo vas da unesete aktivnost",
          minlength: "Morate unijeti minimalno 3 karaktera",
        },
        dan: {
          required: "Molimo vas da unesete dan",
          minlength: "Morate unijeti minimalno 5 karaktera",
        },
        vrijemePocetka: {
          required: "Molimo vas da unesete vrijeme pocetka",
          minlength: "Morate unijeti minimalno 5 karaktera",
          maxlength: "Mozete unijeti maksimalno 5 karaktera",
        },
        vrijemeKraja: {
          required: "Molimo vas da unesete vrijeme kraja",
          minlength: "Morate unijeti minimalno 5 karaktera",
          maxlength: "Mozete unijeti maksimalno 5 karaktera",
        },
      },
      // submitHandler: function (form) {
      //   form.submit();
      // },
    });
  });