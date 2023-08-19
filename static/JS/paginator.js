const paginator = document.querySelector(".Paginator-place");
var currentPage = 1
var totalPages  = 1

function UpdatePaginator(){
  currentPage= 1
  let paghmtl = ""
  for (let i = 1; i <= totalPages; i++) {
    paghmtl += " <div class='Paginator-box hidden'> <p>" + i + "</p> </div>"
  }
  paginator.innerHTML = paghmtl
  paginatorBoxes = paginator.querySelectorAll(".Paginator-box");
  generateVisibleButtons()
  changePage(currentPage)
}

function prevPage(){
  if (currentPage > 1){
    currentPage--;
    changePage(currentPage)
    generateVisibleButtons();
  }
}
function nextPage(){
  if (currentPage < totalPages){
    currentPage++;
    changePage(currentPage)
    generateVisibleButtons();
  }
}

function changePage(i) {
  var elements = document.querySelectorAll('[class*="page-"]');
  elements.forEach(element => {
    element.style.display = 'none';
  });

  var targetElement = document.querySelectorAll(`.page-${i}`);
  targetElement.forEach(element => {
    element.style.display = 'grid';
  });
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

  paginatorBoxes.forEach((element, index) => {
    element.classList.add("hidden")
    element.classList.remove("active")
    element.removeEventListener("click", handlePaginatorBoxClick); // удаление старого обработчика
    if (index < totalPages) { // добавление нового обработчика для элементов, которые отображают номера страниц
      element.addEventListener("click", handlePaginatorBoxClick);
    }
  });

  function handlePaginatorBoxClick(event) {
    const clickedBox = event.currentTarget;
    const clickedPageIndex = Array.from(paginatorBoxes).indexOf(clickedBox) + 1;
    if (clickedPageIndex !== currentPage) { // проверка, что страница не была уже открыта
      currentPage = clickedPageIndex;
      changePage(currentPage);
      generateVisibleButtons();
    }
  }

  buttons.forEach( el => {
    paginatorBoxes[el-1].classList.remove("hidden");
    if (el === currentPage) {
      paginatorBoxes[el-1].classList.add("active");
    }
  });
}


