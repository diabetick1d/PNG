$("#ResetSearch").hide()
$(document).ready(function() {
  const resultsbrand = $(".results");
  const resultsbrandbox = $(".result-box");
  const searchInputBrand = $("#search-input-brand");

  let timer_send
  searchInputBrand.on('input', function() {
      clearTimeout(timer_send);
      timer_send = setTimeout(() => {
        if (!(searchInputBrand.val() === '' || searchInputBrand.val() === " ")) {
            $.ajax({
                url: '/brands/search/',
                type: "POST",
                data: { "query": searchInputBrand.val() },
                success: response => {
                    let count_search = response.results.length;
                    let html = '';
                    for (let i = 0; i < count_search; i++) {
                        html += '<a class="img-brand" href="/product/' + response.results[i].name + '">' +
                            '<img src="/media/' + response.results[i].img + '" alt=""></a>';
                    }
                    if (count_search > 0) {
                        resultsbrandbox.addClass("open");
                    } else {
                        resultsbrandbox.removeClass("open");
                    }
                    resultsbrand.html(html);
                },
                error: function(xhr, status, error) {
                    console.error('Request failed', xhr);
                }
            });
        } else {
            resultsbrand.html(" ");
        }
    }, 300);
  });

  const compilations = $(".compilation-box");
  const compilation  = compilations.find(".compilations");
  const brandresults = $(".result-box");
  const allcatalog   = $(".all-catalog");
  const reset        = $("#ResetSearch")

  const touch = $("#touch-more");
  const ponn  = $("#onmore");
  const poff  = $("#offmore");

  const searchbrand = $('#search-input-brand');

  touch.on("click", function() {
      const isOpen = compilation.hasClass("open");
      poff.toggleClass("active", !isOpen);
      ponn.toggleClass("active", isOpen);
      compilation.toggleClass("open");
  });

  $(document).keyup(function(e) {
      if (e.key === "Escape") {
          RemoveBrandSearch();
          searchbrand.blur();
      }
  });

  function RemoveBrandSearch() {
    compilations.removeClass("hide");
    brandresults.removeClass("active");
    allcatalog.removeClass("hide");
    touch.removeClass("hide");
    resultsbrand.html("");
    searchbrand.val("");
    reset.hide()
  }

  function AddBrandSearch() {
    compilations.addClass("hide");
    compilation.removeClass("open");
    brandresults.addClass("active");
    allcatalog.addClass("hide");
    touch.addClass("hide");
    poff.removeClass("active");
    ponn.addClass("active");
    reset.show()
  }

  reset.click(RemoveBrandSearch)
  searchbrand.on("focus", AddBrandSearch);
});