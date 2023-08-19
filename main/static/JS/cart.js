function ChangeInfo(){
    var totalPrice          = 0;
    var semiPrice           = 0;
    var activeProductsCount = 0; 
    var promocode = $("#promocode-price").data('price')
    
    $('.product').each(function() {
        if ($(this).hasClass('active')) {
            price = parseInt($(this).data('price'));
            semiPrice += price
            if (promocode) {
                price = price - parseInt(promocode);
            }
            activeProductsCount += 1
            totalPrice          += price;
        }
    });
    if (totalPrice < 0) {
        totalPrice = 0;
    }
    $("#promocode-price h4").text(`-${promocode * activeProductsCount} ₽`);
    $('#products-count h6').text(`${activeProductsCount} товаров`);
    $('#products-price h4').text(`${semiPrice} ₽`);
    $('#summ-price h4').text(`${totalPrice} ₽`);
}

$(document).ready(function() {
    ChangeInfo()
    $(".product label").click(function(){
        if (!$(this).hasClass("no")){
            if ($(this).hasClass("active")) {
                $(this).parent().removeClass("active");
                $(this).removeClass("active");
            } else {
                $(this).parent().addClass("active");
                $(this).addClass("active");
            }
        }
        ChangeInfo();
    });
    $(".product #remove").click(function() {
        var parent = $(this).parent().parent();
        if (!parent.hasClass("remove")){
            $.post("/remove_cart/", 
                {
                    uid:  parent.data("uid"),
                    size: parent.data("size")
                },
                function(data){
                    if (data.success){
                        parent.addClass("remove")
                        timer_promo = setTimeout(() => {
                            parent.remove();
                            ChangeInfo();
                            if ($(".product").length < 1){
                                $(".cartlist").remove();
                                $("<div class='else'>Теперь тут пусто...</div>").appendTo('.body');
                            }
                        }, 900);
                    }
                    if (data.message){
                        Notifications(data.message,data.error);
                    }
                });
        }
    });
    let timer_promo
    $('#inputpromo').on("input",function() {
        clearTimeout(timer_promo);
        timer_promo = setTimeout(() => {
            $.post("/check_promo/", 
            {
                promocode:  $("#inputpromo").val(),
            },

            function(data){
                if (data.success){
                    $("#promocode-price").data("price", parseInt(data.price));
                    $("#promocode-price").show();
                    $("#promocheckfalse").removeClass("active")
                    $("#promochecktrue").addClass("active")
                } else {
                    $("#promocode-price").data("price", 0);
                    $("#promocode-price").hide();
                    $("#promochecktrue").removeClass("active")
                    if ($("#inputpromo").val() == ""){
                        $("#promocheckfalse").removeClass("active")
                    } else {
                        $("#promocheckfalse").addClass("active")
                    }
                }
                ChangeInfo();
            });
        },400);
    });
    $("#promocode-price").hide();
});
