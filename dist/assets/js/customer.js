//function init_plugins() {
$(function () {
  "use strict";

  $(function () {
    $(".preloader").fadeOut();
  });

  // ==============================================================
  // comportamiento segun el dispositivo
  // ==============================================================
  var set = function () {
    var width = window.innerWidth > 0 ? window.innerWidth : this.screen.width;
    var topOffset = 0;
    console.log("function set");
    if (width < 768) {
      $("body").addClass("movil-sidebar").removeClass("mini-sidebar");
    } else if (width >= 768 && width < 1200) {
      $("body").addClass("mini-sidebar").removeClass("movil-sidebar");
    } else {
      $("body").removeClass("mini-sidebar").removeClass("movil-sidebar");
    }
    // if (width <= 575.98) {
    //   $(".modos").addClass("movil").removeClass("mini-sidebar");
    // } else {
    //   $(".modos").removeClass("movil");
    // }
  };
  $(window).ready(set);
  $(window).on("resize", set);

  // ==============================================================
  // click en el boton menu
  // ==============================================================

  $("body .btn-menu").on("click", function (e) {
    console.log("jjjj");
    if ($("body").hasClass("movil-sidebar")) {
      $("body").trigger("resize");
      $(".sidebar").toggleClass("show");
    } else {
      $("body").trigger("resize");
      $("body").toggleClass("mini-sidebar");
      $(".item-menu .submenu").removeClass("show");
      $(".item-menu > a").attr("aria-expanded", "false");
    }
  });

  $(".item-menu > a").on("click", function () {
    $(".item-menu > a").removeClass("active");
    //$(".item-menu > a").removeClass("active");
    //Ocultamos todos los submenus desplegados
    $(".item-menu .submenu").removeClass("show");
    $(".item-menu > a").attr("aria-expanded", "false");
    var $this = $(this);
    var checkelement = $(this).next();
    console.log(checkelement);
    $(this).addClass("active");
  });
});
// });
//}
