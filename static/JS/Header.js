/// Search
const overlay           = document.querySelector(".overlay");
const SearchButton      = document.querySelector('.search-button');
const closeSearchButton = document.querySelector('.close-search');
const HeaderSearch      = document.querySelector('.Header-search');

function Removesofi() {
  if ($('#filter-form').length > 0 || $('#sorting-form').length > 0) {
    $("#filter-form").removeClass('active');
    $("#sorting-form").removeClass('active');
    $("#Filter-button").removeClass('active');
    $("#Sorting-button").removeClass('active');
  }
};

function RemoveSeacrh() {
  SwitchSearchButton();removeOverlay()
  HeaderSearch.classList.remove('active');
};

function AddSearch() {
  SwitchSearchButton();addOverlay()
  if (contents.classList.contains("active")){
    contents.classList.remove("active");
    tablabels.forEach((label) => {label.classList.remove("active");});
    dropdowns.forEach((drop)  => {drop.classList.remove("active");});
  }
  Removesofi()
  HeaderSearch.classList.add('active');
  HeaderSearch.querySelector("input").focus();
};

overlay.addEventListener('click', function() {
  if (HeaderSearch.classList.contains("active")){
    RemoveSeacrh();removeOverlay()
  } else if (contents.classList.contains("active")){
    contents.classList.remove("active");
    tablabels.forEach((label) => {label.classList.remove("active");});
    dropdowns.forEach((drop)  => {drop.classList.remove("active");});
    removeOverlay()
  } else {
    removeOverlay()
  }
});

/// Search
function SwitchSearchButton(){
  if (!SearchButton.classList.contains('hidden')){
    SearchButton.classList.add('hidden');
    closeSearchButton.classList.remove('hidden');
  } else {
    SearchButton.classList.remove('hidden');
    closeSearchButton.classList.add('hidden');
  }
}

function addOverlay(){overlay.classList.add("active")}
function removeOverlay(){overlay.classList.remove("active");}

/// Tabs
const HeaderCat = document.querySelector(".Header-cat")
const tabs      = HeaderCat.querySelector(".tabs")
const contents  = HeaderCat.querySelector(".contents")
const tablabels = tabs.querySelectorAll("label")
const dropdowns = contents.querySelectorAll(".dropdown-content")
var hoverTimer

function handleClick(event,tab,content){
  if (tab.classList.contains("active")){
    window.location.href = (tab.getAttribute("data-href"))
  } else {ActiveDropdown(tab,content)}
};

function handleHover(event,tab,content){
  if (contents.classList.contains("active")){
    ActiveDropdown(tab,content)
  } else {
    ActiveDropdown(tab,content)
  }
};

function handleMouseLeave(event,tab,content){
  if (event.relatedTarget != contents &&
      event.relatedTarget != tabs &&
      event.relatedTarget != content){
    DeactiveDropdown(tab,content)
  }
};

function DeactiveDropdown(tab, content) {
  if (!HeaderSearch.classList.contains("active")){
    contents.classList.remove("active");
    tab.classList.remove("active");
    content.classList.remove("active");
    removeOverlay()
  }
};
function ActiveDropdown(tab, content) {
  if (!HeaderSearch.classList.contains("active") && !tab.classList.contains("active")){
    tablabels.forEach((label) => {label.classList.remove("active");});
    dropdowns.forEach((drop)  => {drop.classList.remove("active");});
    contents.classList.add("active");
    tab.classList.add("active");
    content.classList.add("active");
    addOverlay()
  }
};

tablabels.forEach((label) => {
  let content = contents.querySelector(label.getAttribute("data-content"))

  label.addEventListener('mouseenter', (event) => {
    if (!contents.classList.contains("active")) {
      hoverTimer = setTimeout(() => {
        // console.log("handleHover with delay", event.target);
        handleHover(event, label, content);
      }, 200);
    } else {
      // console.log("handleHover without delay", event.target);
      handleHover(event, label, content);
      clearTimeout(hoverTimer);
    }
  });

  label.addEventListener('mouseleave', (event) => {
    // console.log("handleMouseLeave",event.relatedTarget);
    handleMouseLeave(event,label,content)
    if (hoverTimer) {
      clearTimeout(hoverTimer);
    }
  });

  label.addEventListener('click',      (event) => {
    // console.log("handleClick",event.target);
    handleClick(event,label,content)
  });

  HeaderCat.addEventListener('mouseleave', (event) => {
    if (event.relatedTarget != tabs){
      DeactiveDropdown(label,content)
    }
  });

  if ('ontouchstart' in window) {
    label.addEventListener('touchstart', (event) => {
      event.preventDefault();
      handleClick(event,label,content);
    });
  }
});

