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

check_gav = false
const promocode  = $(".order-list").data("promocode")


function order(){
    $.post("/order/check", 
        {
            'csrfmiddlewaretoken': $('input[name="csrfmiddlewaretoken"]').val(),
            "promocode":           promocode,
            "type_delivery":       $(".type input").prop("checked"),
            "first_name":          $("#first_name").val(),
            "last_name":           $("#last_name").val(),
            "surname":             $("#surname").val(),
            "number_phone":        $("#number_phone").val(),
            "adress":              $("#adress").val(),
            "delivery_point":      $("#point").val(),

            "products":            uid_list,
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
            success_order()
        });
    }


function success_order(){
    $(".deliver-info").addClass("success");
    $(".payment-method").addClass("success");
    $(".callback").addClass("success");
    if (success){
        $(".true").addClass("active");
        $(".false").removeClass("active");
    } else {
        $(".true").removeClass("active");
        $(".false").addClass("active");
    }
}


$('.input-box input').on('input', function() {
    if ($(this).hasClass("not-valid") && $(this).val() != '') {
        $(this).removeClass("not-valid")
    }
});

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
    if (!$("#politic").is(":checked")) {
        $(".politic-box").addClass("box-not-valid");
        isValid = false;
        setTimeout(function() {
            $(".politic-box").removeClass("box-not-valid");
        }, 1000)
    }

    if (isValid) {
        order()
    } else {
        setTimeout(function() {
            $(".input-box input").removeClass("not-valid")
        }, 1000) 
    };
});
