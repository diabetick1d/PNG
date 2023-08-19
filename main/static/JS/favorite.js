

$(document).ready(function() {
    $(".product #deletefavourite").click(function(){
        var product_uid = $(this).attr("data-product-id")
        $(this).parent().remove();
        $.post("/add_favorite/", 
            {
                uid: product_uid,
            },
            function(data){
            });
        if ($('.product-list .product').length < 1){
            $(".product-list").remove();
            $("<div class='else'>Теперь тут пусто...</div>").appendTo('.body');
        }
    });
});
