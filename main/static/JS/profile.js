gotopa = $(".menu").data("open");
if (["bonus", "buylist", "returns"].includes(gotopa)) {
    $("[id='navigation " + gotopa).attr("checked", true);
    $("[id='" + gotopa).addClass("active");
} else {
    $("[id='navigation personal").attr("checked", true);
    $("#personal").addClass("active");
}

$(document).ready(function() {
    // Смена страниц по навигации
    $('.navigation-menu input').change(function() {
        $('.blockmenu').removeClass('active');
        
        $(".blockbuy").removeClass("active");
        $('#buylist #switch-full').removeClass("active");
        $('#returns #switch-full').removeClass("active");

        $('#' + $(this).attr('id').replace('navigation ', '')).addClass('active');
        if ('#' + $(this).attr('id').replace('navigation ', '') == "#bonus"){
            for (var i of count){
                $('#bonus-' + i + '').slick("slickGoTo", 0)
            }
        }
    });

    // Персонал - Тип доставки
    function active_SDEK(){
        $(".typebox").removeClass('active');
        $("#id_base_delivery_point").attr('placeholder', 'Адрес пункта выдачи');
        $("#SDEK_TYPE").addClass('active');
        $("#RUSSIA_TYPE").removeClass('active');
    }
    function active_RUSSIA(){
        $(".typebox").addClass('active');
        $("#id_base_delivery_point").attr('placeholder', 'Индекс пункта выдачи');
        $("#RUSSIA_TYPE").addClass('active');
        $("#SDEK_TYPE").removeClass('active');
    }

    if ($(".type_deliver").attr("checktype") === '1') {active_RUSSIA()}
    $('.type_deliver').click(function(e) {
        if ($("#id_base_type_deliver").is(":checked")) {
            active_SDEK();
            $('#id_base_delivery_point').val('');
        } else {
            active_RUSSIA();
            $('#id_base_delivery_point').val('');
        }
    });

    // Список покупок
    $('#buylist #switch-full').click(function(e) {
        var order = $(this).data("order")
        if ($("#" + order).hasClass("active")) {
            $("#" + order).removeClass("active");
            $(this).removeClass("active");
        } else {
            $("#" + order).addClass("active");
            $(this).addClass("active");
        }
    })
    $("#buylist #switch-full-bottom").click(function(e) {
        var order = $(this).data("order")
        $("#" + order).removeClass("active");
        $("#" + order).find("#switch-full").removeClass("active");
    });

    // Отслеживание заказа
    $('#buylist .blockbuy').each(function() {
        let staturru = $(this).find(".order-status h2").text()
        if (["Заказано","Отправлено","Досталено в Россию"].includes(staturru)) {
            $(this).find(".indicators-deliver #In_road").addClass("active");
        }
        if (staturru == "На складе") {
            $(this).find(".indicators-deliver #In_stock").addClass("active"); 
        }
        if (["Доставлено в пункт","Получено"].includes(staturru)) {
            $(this).find(".indicators-deliver #In_deliver").addClass("active");
        }
    })

    // Возвраты
    $('#returns #switch-full').click(function(e) {
        var Return = $(this).data("return")
        if ($("#" + Return).hasClass("active")) {
            $("#" + Return).removeClass("active");
            $(this).removeClass("active");
        } else {
            $("#" + Return).addClass("active");
            $(this).addClass("active");
        }
    })

    $("#returns #switch-full-bottom").click(function(e) {
        var Return = $(this).data("order")
        $("#" + Return).removeClass("active");
        $("#" + Return).find("#switch-full").removeClass("active");
    });
});

// Проверка перед отправкой формы-персонал

$(document).ready(function() {
    $('.input-box input').on('input', function() {
        if ($(this).val() != '') {
            $(this).removeClass("not-valid")
        }
    });
    let isAnimating = false
    
    $('.submit-personal').click(function(e) {
        e.preventDefault();
        if ($("#personal").hasClass('active')){
            var firstError = null;
            var isValid = true;
            $('#personal input').each(function() {
                if ($(this).val() == '') {
                    $(this).addClass("not-valid")
                    isValid = false;
                    if (firstError == null) {
                        firstError = $(this);
                    }
                }
            });
            if (firstError != null) {
                $('html, body').animate({
                    scrollTop: firstError.offset().top - 200
                }, 800);
            };
            if ($("#politicbox").length > 0) {
                if (!$("#id_up_to_politic").is(":checked")) {
                    if (!isAnimating) {
                        $("#politicbox").addClass("box-not-valid");
                        isAnimating = true;
                        setTimeout(function() {
                            $("#politicbox").removeClass("box-not-valid");
                            isAnimating = false;
                        }, 1000)
                    }
                    isValid = false;
                }
            }
            if (isValid) {
                $('#personal').submit();
            };
        };
    });

    $('#return-query-form button').click(function(e) {
        e.preventDefault();

        var isValid = true;
        parent = $(this).parent().parent();
        parent.find($('input')).each(function() {
            if ($(this).val() == '') {
                $(this).addClass("not-valid")
                isValid = false;
            }
        });
        if (! (/^[0-9]+$/.test( parent.find("#card_number").val() )) ) {
            isValid = false;
            (parent.find("#card_number")).addClass("not-valid");
        }
        
        if (isValid) {
            $.ajax({
                url: `/return/update`,
                type: "POST",
                data: {
                    'csrfmiddlewaretoken': parent.find($('input[name="csrfmiddlewaretoken"]')).val(),
                    "uid":        parent.data("uid"),
                    "card_number": parent.find("#card_number").val(),
                    "bank":       parent.find("#bank").val(),
                    "name":       parent.find("#name").val(),
                },
                success: response => {
                    if (response.success == true) {
                        parent.addClass("active");
                    } else {
                        console.error(response.error);
                    }
                },
                error: (xhr, status, error) => {
                    console.error(error);
                }
            });
        };
    });


    // bonus
    userbonus = $("#bonus").data("bonus")
    $("#bonus .center-number span1").text(userbonus)

    // Обновление индикаторов
    function update_indicators() {
        $(".indicator-box").removeClass("semi");
        $(".indicator-box").removeClass("full");
        need = parseInt($("#bonus .center-number span").text());
        indnumber = (userbonus / need) * 20;
        for (var i = 1; i <= Math.floor(indnumber - 1); i++) {
            $("#indicator-" + i).addClass("full");
        }
        if (userbonus == need){
            $("#indicator-" + (Math.floor(indnumber))).addClass("full");
        } else {
            $("#indicator-" + (Math.floor(indnumber))).addClass("semi");
        }
        if (userbonus >= need) {
            $("#submit-bonus").addClass("full");
        } else {
            $("#submit-bonus").removeClass("full");
        }
        $("#bonus .user-info h1").text($(".selected-img").attr("data-product-name"))
    }
    update_indicators()
    
    // Копирование сслыки    
    $(".copy-box").click(function(){
        navigator.clipboard.writeText($("#bonus").data("ref"))
        $("#bonus .copy-link .copy-box").addClass("animate")
        timer = setTimeout(function(){
            $("#bonus .copy-link .copy-box").removeClass("animate")
        }, 400)
    })
    
    // Обьявление слайдеров
    count = ($(".slider-choose").data("count")).replace(/\s/g, "").split(",");
    check = true

    for (var i of count){
        $('#bonus-' + i + '').slick({
            slidesToShow:  5,
            infinity:      true,
            centerMode:    true,
            arrows:        false,
            draggable:     false,
            centerPadding: '20px',
            responsive: [
                {
                    breakpoint: 500,
                    settings: {
                        slidesToShow: 1,
                        infinity:      true,
                        arrows:        false,
                        centerMode:    false,
                    }
                }
            ]
        })
        
        if (check == true){
            check = false
            $('#bonus-' + i + '').addClass('active')
            $('#number-bonus-' + i + '').addClass('current')
        } else {
            $('#bonus-' + i + '').removeClass('active')
            $('#number-bonus-' + i + '').removeClass('active')
        }
    }

    // Стрелочки
    $(".slick-arrow.next").click(function(){
        $(".slick-slider").each(function(){
            if ($(this).hasClass('active')) {
                $(this).slick("slickNext")
                current = $(this).find(".slick-slide.slick-current img").attr("src")
                $(".selected-img").attr("data-product", $(this).find(".slick-slide.slick-current div").attr("id"))
                $(".selected-img").attr("data-product-name", $(this).find(".slick-slide.slick-current h1").text())
                $(".selected-img img").attr("src", current)
            }
        })
        update_indicators()
    })
    $(".slick-arrow.prev").click(function(){
        $(".slick-slider").each(function(){
            if ($(this).hasClass('active')) {
                $(this).slick("slickPrev")
                current = $(this).find(".slick-slide.slick-current img").attr("src")
                $(".selected-img").attr("data-product", $(this).find(".slick-slide.slick-current div").attr("id"))
                $(".selected-img").attr("data-product-name", $(this).find(".slick-slide.slick-current h1").text())
                $(".selected-img img").attr("src", current)
            }
        })
        update_indicators()
    })

    // отдаление/приблежение слайда
    // $(".slick-slider").on("beforeChange", function(event, slick, currentSlide, nextSlide){
    //     console.log("currentSlide",currentSlide)

    //     slick.$slider.find(".slick-slide").each(function(){
    //         $(this).removeClass("semi semi-full full")
    //         $(this).addClass(slick_index[$(this).attr("data-slick-index")])
    //     })
    // })

    // Переключение между слайдерами

    // С помощью плюс/минус
    $(".mpromo").click(function(){
        if (!$(this).hasClass("cant-go")){
            index_cur = count.indexOf($(".number-bonus.current").text())
            $(".center-number span").text(count[index_cur - 1])
            $(".number-bonus").removeClass("current")
            $(".slick-slider").removeClass("active")
            $(".ppromo").removeClass("cant-go")

            let bon = $("#bonus-" + count[index_cur - 1])
            bon.addClass("active")
            $("#number-bonus-" + count[index_cur - 1]).addClass("current")
            $(".selected-img").attr("data-product", bon.find(".slick-slide.slick-current div").attr("id"))
            $(".selected-img").attr("data-product-name", bon.find(".slick-slide.slick-current h1").text())
            $(".selected-img img").attr("src", bon.find(".slick-slide.slick-current img").attr("src"))

            if (count[index_cur - 2]){
                $(".mpromo").removeClass("cant-go")
            } else {
                $(".mpromo").addClass("cant-go")
            }
            update_indicators()
        }
    })
    $(".ppromo").click(function(){
        if (!$(this).hasClass("cant-go")){
            index_cur = count.indexOf($(".number-bonus.current").text())
            $(".center-number span").text(count[index_cur + 1])
            $(".number-bonus").removeClass("current")
            $(".slick-slider").removeClass("active")
            $(".mpromo").removeClass("cant-go")

            let bon = $("#bonus-" + count[index_cur + 1])
            bon.addClass("active")
            $("#number-bonus-" + count[index_cur + 1]).addClass("current")
            $(".selected-img").attr("data-product", bon.find(".slick-slide.slick-current div").attr("id"))
            $(".selected-img").attr("data-product-name", bon.find(".slick-slide.slick-current h1").text())
            $(".selected-img img").attr("src", bon.find(".slick-slide.slick-current img").attr("src"))

            if (count[index_cur + 2]){
                $(".ppromo").removeClass("cant-go")
            } else {
                $(".ppromo").addClass("cant-go")
            }
            update_indicators()
        }
    })

    // С помощью левой панели

    $(".tier-box").click(function(){
        count_this = $(this).find("h1").text()
        index_cur  = count.indexOf(count_this)
        $(".center-number span").text(count_this)

        $(".number-bonus").removeClass("current")
        $(".slick-slider").removeClass("active")
        $(".mpromo").removeClass("cant-go")
        $(".ppromo").removeClass("cant-go")

        $(".get-it").removeClass("active")
        
        let bon = $("#bonus-" + count_this)
        bon.addClass("active")
        $("#number-bonus-" + count_this).addClass("current")
        $(".selected-img").attr("data-product", bon.find(".slick-slide.slick-current div").attr("id"))
        $(".selected-img").attr("data-product-name", bon.find(".slick-slide.slick-current h1").text())
        $(".selected-img img").attr("src", bon.find(".slick-slide.slick-current img").attr("src"))

        if (count[index_cur - 1]){
            $(".mpromo").removeClass("cant-go")
        } else {
            $(".mpromo").addClass("cant-go")
        }

        if (count[index_cur + 1]){
            $(".ppromo").removeClass("cant-go")
        } else {
            $(".ppromo").addClass("cant-go")
        }
        update_indicators()
    })

    // Кнопка обменять
    $("#submit-bonus").on("click", function(){
        if (userbonus >= need){
            if (!$(".selected-img").attr("data-product-name")){
                let bon = $('[id^="bonus-"]:first')
                $(".selected-img").attr("data-product", bon.find(".slick-slide.slick-current div").attr("id"))
                $(".selected-img").attr("data-product-name", bon.find(".slick-slide.slick-current h1").text())
            }
            $(".get-it").addClass("active")
            
            $(".bonus-get img").attr("src", $(".selected-img img").attr("src"))
            $(".get-it p span").text($(".selected-img").attr("data-product-name"))

            let sid = $(".slick-slider.active").attr("id").replace("bonus-", "")
            let pid = $(".selected-img").attr("data-product").replace("product-", "")
            $("#bonushref").attr("href", "/get-bonus/" + sid + "&" + pid)
        }
    })
});

// Кнопка убрать обменять
function removebonget(){
    $(".get-it").removeClass("active")
}
