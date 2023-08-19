
function ChangeInfo(){
    var totalPrice          = 0;
    var semiPrice           = 0;
    var activeProductsCount = 0;
    
    $('.product').each(function() {
        if ($(this).hasClass('active')) {
            price = parseInt($(this).data('price')); 
            semiPrice += price
            if ($(".promocode-price").data('price')) {
                price = price - parseInt($(".promocode-price").data('price'));
            }
            activeProductsCount += 1
            totalPrice += price;
        }
    });

    $('.products-count h6').text(`${activeProductsCount} товаров`);
    $('.products-price h2').text(`${semiPrice} ₽`);
    $('.summ-price h2').text(`${totalPrice} ₽`);
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
                    }, 1400);
                }
                Notifications(data.message,data.error)
            });
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
                    $(".promocode-price").data("price", data.price);
                    $(".promocode-price h2").text(data.price);
                    $("#promochecktrue").addClass("active")
                } else {
                    $(".promocode-price").data("price", 0);
                    $(".promocode-price h2").text("0");
                    $("#promochecktrue").removeClass("active")
                }
                ChangeInfo();
            });
        },600);
    });
});
