const paginator    = $(".Paginator-place");
const allPaginator = $(".Paginator");

if ((/mobile/i.test(navigator.userAgent) && window.innerWidth < 500)) {
  let timer_scroll
  console.log("SADAS");
  $(document).ready(function() {
    window.addEventListener("scroll", function() {
      if (window.innerHeight + window.pageYOffset > document.querySelector("#product-list").scrollHeight - 300) {
        if (!timer_scroll){
        timer_scroll = setTimeout(function(){
          if (currentPage < totalPages){
            currentPage++;
            changePage(currentPage)
            generateVisibleButtons();
            timer_scroll = false
            }
          }, 100)
        }
      }
    })
  })
}
function UpdatePaginator(pages){
  totalPages  = parseInt(pages)
  currentPage = 1
  if (totalPages > 1){
    allPaginator.show()
    let paghmtl = ""
    for (let i = 1; i <= totalPages; i++) {
      paghmtl += "<div class='Paginator-box hidden'> <p>" + i + "</p> </div>"
    }
    paginator.html(paghmtl)
    paginatorBoxes = paginator.find(".Paginator-box");
    generateVisibleButtons()
    $('[class*="page-"]').hide();
    $(`.page-${1}`).show();
  } else {
    allPaginator.hide()
  }
}
UpdatePaginator($(".Paginator").attr("defpages"))

$("#back").click(() =>{
  if (currentPage > 1){
    currentPage--;
    changePage(currentPage)
    generateVisibleButtons();
  }
})

$("#next").click(() =>{
  if (currentPage < totalPages){
    currentPage++;
    scrollToTop()
    changePage(currentPage)
    generateVisibleButtons();
  }
})
function changePage(i) {
  $('[class*="page-"]').hide();
  $(`.page-${i}`).show();
  get_page(i)
}

function generateVisibleButtons() {
  const buttons = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      buttons.push(i);
    }
  } else {
    if (currentPage <= 3) {
      for (let i = 1; i <= 4; i++) {
        buttons.push(i);
      }
      buttons.push(totalPages);
    } else if (currentPage >= totalPages - 2) {
      buttons.push(1);
      for (let i = totalPages - 3; i <= totalPages; i++) {
        buttons.push(i);
      }
    } else {
      buttons.push(1);
      for (let i = currentPage - 1; i <= currentPage + 1; i++) {
        buttons.push(i);
      }
      buttons.push(totalPages);
    }
  }

  paginatorBoxes.each((index, element) => {
    $(element).addClass("hidden").removeClass("active");
    $(element).off("click", handlePaginatorBoxClick);

    if (index < totalPages) {
      $(element).on("click", handlePaginatorBoxClick);
    }
  });

  function handlePaginatorBoxClick(event) {
    const clickedBox = $(event.currentTarget);
    const clickedPageIndex = Array.from(paginatorBoxes).indexOf(clickedBox[0]) + 1;

    if (clickedPageIndex !== currentPage) {
      currentPage = clickedPageIndex;
      changePage(currentPage);
      generateVisibleButtons();
    }
  }

  buttons.forEach( el => {
    $(paginatorBoxes[el-1]).removeClass("hidden");
    if (el === currentPage) {
      $(paginatorBoxes[el-1]).addClass("active");
    }
  });
}