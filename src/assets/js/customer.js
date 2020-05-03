$(function () {
  "use strict";

  $("body").on("click", ".btn-menu", function (e) {
    e.stopPropagation();
    if ($("body .modos").hasClass("movil")) {
      $(".sidebar").toggleClass("show");
    } else {
      $(".modos").toggleClass("mini-sidebar");
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

  // ==============================================================
  // This is for the top header part and sidebar part
  // ==============================================================
  var set = function () {
    var width = window.innerWidth > 0 ? window.innerWidth : this.screen.width;
    var topOffset = 0;
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
