$(document).ready(function () {
  $(".btn-menu").on("click", function () {
    if ($(".modos").hasClass("movil")) {
      $(".sidebar").toggleClass("show");
    } else {
      $(".modos").toggleClass("mini-sidebar");
    }
  });

  // ==============================================================
  // This is for the top header part and sidebar part
  // ==============================================================
  var set = function () {
    var width = window.innerWidth > 0 ? window.innerWidth : this.screen.width;
    var topOffset = 0;
    console.log(width);
    if (width <= 575.98) {
      $(".modos").addClass("movil").removeClass("mini-sidebar");
    } else {
      $(".modos").removeClass("movil");
    }
    //if (width < 1170) {
    //$("body").addClass("mini-sidebar");
    //console.log(width);
    //console.log(window.innerWidth);
    //} else {
    //$("body").removeClass("mini-sidebar");
    //  console.log(width);
    //  console.log(window.innerWidth);
    // }
  };
  $(window).ready(set);
  $(window).on("resize", set);
});
