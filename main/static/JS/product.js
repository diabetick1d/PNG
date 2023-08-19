$(document).ready(function(){
  // Размер для всего меню от 1 li
  const ul        = document.querySelector('.slideli');  // подсчёт количество элементов в списке
  if (ul.querySelector('li')){
    var count    = ul.querySelectorAll('li').length;
    var liHeight = document.querySelector('.slideli li').offsetHeight;
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

  // slick slider
  $('.slider__wrapper').slick({
    cssEase: "ease-in-out",
    speed: 350,
    arrows: false,
    adaptiveHeight: true,
  });
  
  $(".slider__btn_prev").click(function(){
    $('.slider__wrapper').slick("slickPrev")
    $(".slider-indicator").removeClass('active');
    $("#ind-" + $('.slider__wrapper').slick("slickCurrentSlide")).addClass("active");
  })
  $(".slider__btn_next").click(function(){
    $('.slider__wrapper').slick("slickNext")
    $(".slider-indicator").removeClass('active');
    $("#ind-" + $('.slider__wrapper').slick("slickCurrentSlide")).addClass("active");
  })
  $('.product-center').on("mouseover", function(){
    $(".slider-indicator").removeClass('active');
    $("#ind-" + $('.slider__wrapper').slick("slickCurrentSlide")).addClass("active");
  })
  $('.product-center').on("touchend", function(){
    $(".slider-indicator").removeClass('active');
    $("#ind-" + $('.slider__wrapper').slick("slickCurrentSlide")).addClass("active");
  })
  $(document).on('keydown', function(event) {
    if (event.which === 37) {
      $('.slider__wrapper').slick("slickPrev")
    } else if (event.which === 39) {
      $('.slider__wrapper').slick("slickNext")
    }
    if ([37, 39].includes(event.which)) {
      $(".slider-indicator").removeClass('active');
      $("#ind-" + $('.slider__wrapper').slick("slickCurrentSlide")).addClass("active")
    }
  });

  $(".slider-indicator").click(function(){
    $(".slider-indicator").removeClass('active');
    $(this).addClass('active');
    $('.slider__wrapper').slick("slickGoTo",$(this).data('slide-to'))
  });
})
  
// Переключение между размерами
$('.slideli li').click(function() {
  var value  = $(this).data('value');
  if (value == "-"){
    value = 0
  }
  var size   = $(this).data('size');
  var inCart = $(this).data('cart');
  box_price  = $('.price')

  if (!$(".box-img-like").hasClass("disabled")){
    if (inCart == "False") {
      $(".add_cart").text("Добавить в корзину");
    } else if (inCart == "True") {
      $(".add_cart").text("Убрать из корзины");
    }
  }
  box_price.text(value + ' ₽');box_price.attr("size", size);box_price.attr("price", value); // добавляем переменные для дальнейшей работы с запросами
  $(".slideli li").removeClass('selected');
  $(this).addClass('selected');
  $(".dropdown-size label span").text(size);
});




// Подсчет кол-во картинок на экране
count_left = $('.img-left').length;
$("#allin").addClass(`left-${count_left}`);

// фукнции для добавления в корзину/избранное
$(document).ready(function() {
  function Buybutton() {
    return new Promise(function(resolve) {
        $(".add-cart-box").addClass("active");
        // Automatically remove the notification after 3 seconds
        setTimeout(function() {
            $(".add-cart-box").removeClass("active");
            resolve(); // Resolve the promise after the notification is removed
        }, 800);
    });
  }


  let timerId
  const product_uid = $(".box-img-like").attr("data-product-id")
  // Добавление в избранное
  $(".box-img-like").click(function(){
    if (!$(this).hasClass("disabled")){
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
              } else {
                if (data.message == "Пользователь не авторизован."){
                  $(".is_authenticated").addClass("active");
                } else if (data.message){
                  Notifications(data.message,data.error);
                }
              }
              timerId = setTimeout(() => {timerId = null},1100);
              }
            }
          );
        }
      }
    });
  // Добавление в корзину
  $(".add-cart-box").click(function(){
    if (!$(this).hasClass("disabled")){
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
                  $(".slideli #" + size).attr("data-cart","False")
                  $(".add_cart").text("Добавить в корзину");
                } else if (data.option === "add"){ // Если добавило
                  $(".slideli #" + size).attr("data-cart","True")
                  $(".add_cart").text("Убрать из корзины");
                }
              } else{
                if (data.message == "Пользователь не авторизован."){
                  $(".is_authenticated").addClass("active");
                } else if (data.message){
                  Notifications(data.message,data.error);
                }
              }
            }
          );
        };
      } else {
        $(".dropdown-size").addClass("no");
        setTimeout(() => {$(".dropdown-size").removeClass("no")},600)
      }
    }
  }
  });

  $("#more_rec").click(function(){
    $(".recommendation-box.two").removeClass("active")
    $(this).hide()
  })
});