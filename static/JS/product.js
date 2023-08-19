// Переключение между размерами
let selectedValue;
$('.slide li').on('click', function() { 
  const value = $(this).find('a').data('value');
  const size  = $(this).find('a').data('size');
  $('.price').text(value + '₽');$('.price').attr("size", size);$('.price').attr("price", value); // добавляем переменные для дальнейшей работы с запросами
  $(".slide li").removeClass('selected');
  $(this).addClass('selected');
});

document.querySelectorAll('.slide li a').forEach(function(element) {
  element.addEventListener('click', function() {
    var value = this.dataset.cart;
    if (value == "False") { // Если товара нету в корзине
      document.querySelector(".add_cart").textContent = "Добавить в корзину";
    } else if (value == "True") { // Если он есть
      document.querySelector(".add_cart").textContent = "Убрать из корзины";
    }
  });
});

// Размер для всего меню от 1 li
const ul        = document.querySelector('.slide');  // подсчёт количество элементов в списке
if (ul.querySelector('li')){
  var count       = ul.querySelectorAll('li').length;
  const liHeight  = document.querySelector('.slide li').offsetHeight;
  if (count > 5) {
    count = 5
    ul.classList.add("scrolling")
  };
  const lires     = count * liHeight + 'px';
  ul.style.setProperty('--liHeight', lires);

  let touch   = document.querySelector(".dropdown-size #touch-size");
  let nav     = document.querySelector(".dropdown-size nav");
  let arrow   = document.querySelector(".dropdown-size .arrow");
  nav.addEventListener("click", function() { // активация выпадающего меню
      if (touch.checked) {
          nav.classList.add("active");
          arrow.classList.add("active");
      } else {
          nav.classList.remove("active");
          arrow.classList.remove("active");
      };
  });
} else {
  document.querySelector(".dropdown-size .arrow").classList.add("hidden")
}


// Подсчет кол-во картинок на экране
const allprod = document.querySelector("#allin");
const img_left= document.querySelectorAll(".img-left");

if ((img_left.length) === 2) {allprod.classList.add("left-2");} 
else if ((img_left.length) === 1) {allprod.classList.add("left-1");} 

// yes
$(document).ready(function() {
  let timerId
  const product_uid = $(".box-img-like").attr("data-product-id")
  // Добавление в избранное
  $(".box-img-like").click(function(){
    if (!timerId) {
      $.post("/add_favorite/", 
        {
          uid: product_uid,
        },
        function(data){
          if (!$(".box-img-like").hasClass("active")){
            if (data.success){
              if (data.option == "add") {
                $(".box-img-like").removeClass("unlike");
                $(".box-img-like").addClass("like");
              } else if (data.option == "remove") {
                $(".box-img-like").removeClass("favorite");
                $(".box-img-like").removeClass("like");
                $(".box-img-like").addClass("unlike");
              }
            }
            Notifications(data.message,data.error);
            timerId = setTimeout(() => {timerId = null},1100);
            }
          }
        );
      }
    });
  // Добавление в корзину
  $(".add-cart-box").click(function(){
    if (!$(".dropdown-size").hasClass("no")) {
      if ($('.price').attr("size")) {
        if (!$(".add-cart-box").hasClass("active")){
          Buybutton()
          let size  = $('.price').attr("size")
          let price = $('.price').attr("price")
          $.post("/add_cart/",
          {
            uid:    product_uid,
            size:   size,
            price:  price,
          },
          function(data){
            if (data.success){
              if (data.option === "remove"){ // Если убрало
                $(".slide li #"+size).attr("data-cart","False")
                $(".add_cart").text("Добавить в корзину");
              } else if (data.option === "add"){ // Если добавило
                $(".slide li #"+size).attr("data-cart","True")
                $(".add_cart").text("Убрать из корзины");
              }
            }
            Notifications(data.message,data.error);
            }
          );
        };
      } else {
        $(".dropdown-size").addClass("no");
        Notifications("Пожалуйста выбирете размер")
        setTimeout(() => {$(".dropdown-size").removeClass("no")},600)
      }
    }
  });
});

