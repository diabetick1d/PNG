const overlay           = $(".overlay");
const SearchButton      = $('.search-button:not(".not-hidden")');
const closeSearchButton = $('.close-search');
const HeaderSearch      = $('.Header-search');
const HeaderCat = $(".Header-cat");
const tabs      = $(".tabs.dropdown");
const contents  = HeaderCat.find(".contents");
const tablabels = tabs.find("a");
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
  
  function handleClick(event, tab, content) {
    if (!tab.hasClass("active")) {
      if (HeaderSearch.hasClass("active")){
        RemoveSeacrh();
      }
      ActiveDropdown(tab, content);
      event.preventDefault();
      console.log("event");
    }
  }

  function handleHover(event, tab, content) {
    ActiveDropdown(tab, content);
  }
  
  function handleMouseLeave(event, tab, content) {
    if (
      event.relatedTarget != contents ||
      event.relatedTarget != tabs ||
      event.relatedTarget != content ||
      event.relatedTarget != HeaderCat
      ) {} else {
        DeactiveDropdown(tab, content);
      }
    }
    
    function DeactiveDropdown(tab, content) {
      if (!HeaderSearch.hasClass("active")) {
        contents.removeClass("active");
      tablabels.removeClass("active");
      content.removeClass("active");
      removeOverlay();
    }
  }
  
  function ActiveDropdown(tab, content) {
    if (
      !HeaderSearch.hasClass("active") &&
      !tab.hasClass("active")
      ) {
        tablabels.removeClass("active");
        dropdowns.removeClass("active");
        contents.addClass("active");
        tab.addClass("active");
        content.addClass("active");
        addOverlay();
      }
    }
    
    tablabels.each(function() {
      let content = contents.find($(this).attr("data-content"));
      
      $(this).on('mouseenter', function(event) {
        if (!contents.hasClass("active")) {
          hoverTimer = setTimeout(function() {
            handleHover(event, $(this), content);
          }.bind(this), 200);
        } else {
          handleHover(event, $(this),content);
          clearTimeout(hoverTimer);
        }
      });
      
      $(this).on('mouseleave', function(event) {
        handleMouseLeave(event, $(this), content);
        if (hoverTimer) {
          clearTimeout(hoverTimer);
        }
      });

      $(this).on('click', function(event) {
      handleClick(event, $(this), content);
    });
    
    HeaderCat.on('mouseleave', function(event) {
      if (event.relatedTarget != tabs.get(0)) {
        DeactiveDropdown($(this), content);
      }
    });
    
    if ('ontouchstart' in window) {
      $(this).on('touchstart', function(event) {
        handleClick(event, $(this), content);
      });
    }
  });
} else {
  function Swtabs() {
    if ($(".tabs.dropdown").hasClass("active")) {
      $(".tabs.dropdown").removeClass("active");
      $(".switchtabs").removeClass("active");
    } else {
      $(".tabs.dropdown").addClass("active");
      $(".switchtabs").addClass("active");
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
