const compilations = document.querySelector(".compilation-box");
const compilation  = compilations.querySelector(".compilations");
const brandresults = document.querySelector(".result-box");
const allcatalog   = document.querySelector(".all-catalog");

const touch        = document.querySelector("#touch-more");
const ponn         = document.querySelector("#onmore")
const poff         = document.querySelector("#offmore")

const closebutton  = document.querySelector(".close-brand-search");
const searchbrand  = document.querySelector('#search-input-brand');

touch.addEventListener("click", function() {
  if (compilation.classList.contains("open")) {
    poff.classList.remove("active")
    ponn.classList.add("active")
    compilation.classList.remove("open");
  } else {
    poff.classList.add("active")
    ponn.classList.remove("active")
    compilation.classList.add("open");
  }
});

$(document).keyup(function(e) {
  if (e.key === "Escape") {
    RemoveBrandSearch()
    searchbrand.blur()
 }
});

function RemoveBrandSearch() {
  compilations.classList.remove("hide");
  brandresults.classList.remove("active");
  allcatalog.classList.remove("hide");
  touch.classList.remove("hide");
  closebutton.classList.add("hide");
  resultsbrand.innerHTML = "";
}

function AddBrandSearch() {
  compilations.classList.add("hide");
  compilation.classList.remove("open");
  brandresults.classList.add("active");
  allcatalog.classList.add("hide");
  touch.classList.add("hide");
  closebutton.classList.remove("hide");
  poff.classList.remove("active")
  ponn.classList.add("active")
}

searchbrand.addEventListener("focus", () => {AddBrandSearch()});

