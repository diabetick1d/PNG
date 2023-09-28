if (!$(".type input").prop("checked")) {
    $("#point").attr('placeholder', 'Адрес пункта выдачи');
} else {
    $("#point").attr('placeholder', 'Адрес и индекс пункта выдачи');
}

$('.type').click(function() {
    if (!$(".type input").prop("checked")) {
        $("#point").attr('placeholder', 'Адрес пункта выдачи');
        $("#point").val('');
    } else {
        $("#point").attr('placeholder', 'Адрес и индекс пункта выдачи');
        $("#point").val('');
    }
});

function order(){
    url  = (window.location.href).split("/")
    prod = url[url.length - 1].split("&");
    console.log(prod);
    $.post(`/get-bonus/check/${prod[0]}&${prod[1]}`, 
        {
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            "type_delivery":       $(".type input").prop("checked"),
            "first_name":          $("#first_name").val(),
            "last_name":           $("#last_name").val(),
            "surname":             $("#surname").val(),
            "number_phone":        $("#number_phone").val(),
            "adress":              $("#adress").val(),
            "delivery_point":      $("#point").val(),

            "size":    $('.dropdown').attr("size"),
        },
        function(data){
            if (data.status == "success"){
                $(".true h1").text(`Заказ ${data.id_order}`)
                check_gav = true;
                success = true;
            } else {
                success = false;
                console.error(data.error);
            }
            check_order()
        });
    }

function check_order(){
    $(".deliver-info").addClass("success");
    $(".top .mobile").addClass("success");
    $(".callback").addClass("success");
    $(".slideli").removeClass("success");
    $(".arrow").addClass("hidden");
    if (success){
        $(".true").addClass("active");
        $(".false").removeClass("active");
    } else {
        if (data.message === "Недостаточно бонусных баллов"){
            $(".false h1").text(data.message)
        }
        $(".true").removeClass("active");
        $(".false").addClass("active");
    }
}

$('#resubm').click(function(e) {
    e.preventDefault();
    if (!check_gav){order()} else {console.error("Заказ уже был создан")}
});

$('#subm').click(function(e) {
    e.preventDefault();
    var isValid = true;
    $('.input-box input').each(function() {
        if ($(this).val() == '') {
            $(this).addClass("not-valid")
            isValid = false;
        }
    });
    if (!$('.dropdown').attr("size")) {
        isValid = false;
        $(".payment-method p").addClass("no");
    }
    if (isValid) {
        order()
    } else {
        setTimeout(function() {
            $(".input-box input").removeClass("not-valid")
        }, 1000) 
    };
});
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
    document.querySelector('.slideli-box').style.setProperty('--liHeight', lires);

    let touch   = document.querySelector(".dropdown-size #touch-size");
    let nav     = document.querySelector(".dropdown-size .dropdown");
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
// Переключение между размерами
$('.slideli li').click(function() {
    var size = $(this).data('size');
    box      = $('.dropdown')
    box.addClass("select")
    if ($(".payment-method p").hasClass("no")) {
        $(".payment-method p").removeClass("no");
    }
    box.find("span").text(size);box.attr("size", size);; // добавляем переменные для дальнейшей работы с запросами
    $("#typesize").addClass("active");
    $(".slideli li").removeClass('selected');
    $(this).addClass('selected');
  });