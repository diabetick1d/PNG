$(document).ready(function() {
    // Смена страниц по навигации
    $('.navigation-menu input').change(function() {
        $('.blockmenu').removeClass('active');
        
        $(".blockbuy").removeClass("active");
        $('#buylist #switch-full').removeClass("active");
        $('#returns #switch-full').removeClass("active");

        $('#' + $(this).attr('id').replace('navigation ', '')).addClass('active');
    });

    // Персонал - Тип доставки
    function active_SDEK(){
        $(".typebox").removeClass('active');
        $("#id_base_adress_SDEK").attr('placeholder', 'Адрес пункта выдачи');
        $("#SDEK_TYPE").addClass('active');
        $("#RUSSIA_TYPE").removeClass('active');
    }
    function active_RUSSIA(){
        $(".typebox").addClass('active');
        $("#id_base_adress_SDEK").attr('placeholder', 'Индекс пункта выдачи');
        $("#RUSSIA_TYPE").addClass('active');
        $("#SDEK_TYPE").removeClass('active');
    }

    if ($(".type_deliver").attr("checktype") === '1') {active_RUSSIA()}
    $('.type_deliver').click(function(e) {
        if ($("#id_base_type_deliver").is(":checked")) {
            active_SDEK();
            $('#id_base_adress_SDEK').val('');
        } else {
            active_RUSSIA();
            $('#id_base_adress_SDEK').val('');
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
});

// Проверка перед отправкой формы-персонал

$(document).ready(function() {
    $('#personal input').on('input', function() {
        if ($(this).val() != '') {
            $(this).removeClass("not-valid")
        }
    });
    let isAnimating = false
    
    $('.submit-personal').click(function(e) {
        if ($("#personal").hasClass('active')){
            e.preventDefault();
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
});