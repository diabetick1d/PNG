const overlay           = $(".overlay");
const SearchButton      = $('.search-button:not(".not-hidden")');
const closeSearchButton = $('.close-search');
const HeaderSearch      = $('.Header-search');
const HeaderCat = $(".Header-cat");
const tabs      = $(".tabs.dropdown");
const contents  = HeaderCat.find(".contents");
const tablabels = $('[id^="tab-btn"]');
const dropdowns = contents.find(".dropdown-content");
var hoverTimer;

function scrollToTop() {
  window.scrollTo({
    top:      0,
    behavior: "smooth"
  });
}

function BodyStopScroll() {
  if ((/Mobi|Android/i.test(navigator.userAgent))) {
    $("body").addClass("stop-scroll");
    $(document).on('scroll', function(e) {
      e.preventDefault();
    });
  }
}

function BodyResScroll() {
  if ((/Mobi|Android/i.test(navigator.userAgent))) {
    $("body").removeClass("stop-scroll");
    $(document).off('scroll');
  }
}



function RemoveSeacrh() {
  SwitchSearchButton();
  removeOverlay();
  HeaderSearch.removeClass('active');
  $("body").removeClass("stop-scroll");
}
function addOverlay() {
  overlay.addClass("active");
}

function removeOverlay() {
  overlay.removeClass("active");
}
function AddSearch() {
  // if ($(".tabs.dropdown").hasClass("active")) {
  //   $(".tabs.dropdown").removeClass("active");
  // }
  SwitchSearchButton();
  addOverlay();
  $("body").addClass("stop-scroll");
  if (contents.hasClass("active")) {
    contents.removeClass("active");
    tablabels.each(function() {
      $(this).removeClass("active");
    });
    dropdowns.each(function() {
      $(this).removeClass("active");
    });
  }
  if (window.is_sofi === true) {
    RemoveFilter()
    RemoveSorting()
  }
  HeaderSearch.addClass('active');
  HeaderSearch.find("input").focus();
}

 
function SwitchSearchButton() { // Смена кнопок у поиска
  if (!SearchButton.hasClass('hidden')) {
    SearchButton.addClass('hidden');
    closeSearchButton.removeClass('hidden');
  } else {
    SearchButton.removeClass('hidden');
    closeSearchButton.addClass('hidden');
  }
}

if (!(/Mobi|Android/i.test(navigator.userAgent))) {
  overlay.on('click', function() {
    if (HeaderSearch.hasClass("active")) {
      RemoveSeacrh();
      removeOverlay();
    } else if (contents.hasClass("active")) {
      contents.removeClass("active");
      tablabels.each(function() {
        $(this).removeClass("active");
      });
      dropdowns.each(function() {
        $(this).removeClass("active");
      });
      removeOverlay();
    } else {
      removeOverlay();
    }
  });

  function deactivetabs(event) {
    if (!($(event.relatedTarget).closest(".Header-cat").length > 0)) {
      tablabels.removeClass("active");
      dropdowns.removeClass("active");
      contents.removeClass("active");
      removeOverlay();
    }
    clearTimeout(hoverTimer);
  }

  function activetab(tab) {
    if (tablabels.hasClass("active")) {
      tablabels.removeClass("active"); // $('[id^="tab-btn"]')
      dropdowns.removeClass("active");
      $(tab.data("content")).addClass("active");
      tab.addClass("active");
    } else {
      event.preventDefault();
      hoverTimer = setTimeout(function() {
        contents.addClass("active");
        addOverlay();
        $(tab.data("content")).addClass("active");
        tab.addClass("active");
      }, 200)
    }
  }

  tablabels.on('click', function(event) {
    if (!$(event.target).hasClass("active")){
      event.preventDefault();
      activetab($(this)); 
    }
    if (HeaderSearch.hasClass("active")){RemoveSeacrh();}
  });
  tablabels.on('touchstart', function(event) {
    if (!$(event.target).hasClass("active")){
      event.preventDefault();
      activetab($(this));
    }
    if (HeaderSearch.hasClass("active")){RemoveSeacrh();}
  });

  tablabels.on("mouseenter", function(event) {
    if (!HeaderSearch.hasClass("active")){
      activetab($(this));
    }
  });
  tabs.on("mouseleave", function(event) {
    if (contents.hasClass("active")){
      deactivetabs(event);
      if (hoverTimer) {clearTimeout(hoverTimer);}
    }
  });
  contents.on("mouseleave", function(event) {
    if (contents.hasClass("active")){
      deactivetabs(event);
    }
  });

} else {
  function Swtabs() {
    if ($(".tabs.dropdown").hasClass("active")) {
      $(".tabs.dropdown").removeClass("active");
      $(".switchtabs").removeClass("active");
      BodyResScroll();
    } else {
      $(".tabs.dropdown").addClass("active");
      $(".switchtabs").addClass("active");
      BodyStopScroll();
    }
    if ($(".Header-search").hasClass("active")) {
      RemoveSeacrh()
    }
    if (window.is_sofi === true) {
      RemoveFilter()
      RemoveSorting()
    }
    if (window.is_product === true) {
      removeSizeChart()
    }
    $("html, body").animate({
      scrollTop: 0
    })
  }
}
