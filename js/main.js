// Fegurð Salon — main.js
// Part 1 scope: this file only sets the footer year.
// Interactivity (form validation, gallery lightbox, map embed, search)
// is implemented in Part 2 and Part 3.

document.addEventListener('DOMContentLoaded', function () {
  var yearEls = document.querySelectorAll('#year');
  var year = new Date().getFullYear();
  yearEls.forEach(function (el) {
    el.textContent = year;
  });
});
