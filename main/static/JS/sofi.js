function StopEvent(event){ event.preventDefault(); location.reload(false);}

// open so or fi
const FiltersForm   = $("#filter-form"),
      SortingForm   = $("#sorting-form"),
      FilterButton  = $("#Filter-button"),
      SortingButton = $("#Sorting-button"),
      ProductsList  = $("#product-list");


      
function SwitchFilter() { // При клике на фильтр  
    if (FiltersForm.hasClass("active")) {
        FiltersForm.removeClass("active");FilterButton.removeClass("active");
        $("body").removeClass("stop-scroll");
    } else {
        FiltersForm.addClass("active"); FilterButton.addClass("active");
        $("body").addClass("stop-scroll");
    }
}
function RemoveFilter() { // Крестик у ui
    FiltersForm.removeClass("active");FilterButton.removeClass("active");
    $("body").removeClass("stop-scroll");
}

function SwitchSorting() { // При клике на сортировку 
    if (SortingForm.hasClass("active")) {
        SortingForm.removeClass("active");SortingButton.removeClass("active");
        $("body").removeClass("stop-scroll");
    } else {
        SortingForm.addClass("active");SortingButton.addClass("active");
        $("body").addClass("stop-scroll");
    }
}

function RemoveSorting() { // Крестик у ui
    SortingForm.removeClass("active");SortingButton.removeClass("active");
    $("body").removeClass("stop-scroll");
}

window.is_sofi = true

$(".top p").hide();

$("#sorting-form li.option").click(function(){
    $("#sorting-form button span").text($(this).text());
    $("#sorting-form li").removeClass("active");
    $(this).addClass("active");
    selected_option["sorting_option"] = $(this).data("value");
    get_page(1,true);
})

// Фильтры
var timer_sent
let timer_test
last_selected_min_price = $('#slide_min').attr('min')
last_selected_max_price = $('#slide_max').attr('max')
selected_option = {
    "sizes":          [],
    "stock":          [],
    "color":          [],
    "material":       [],
    "brand":          [],
    "podcategory":    [],
    "sorting_option": '',

    "min_price":      last_selected_min_price,
    "max_price":      last_selected_max_price,

    "query_page": $("#filter-form").data("search"),
    "brand_page": $("#filter-form").data("brand"),
}

// Получение списка отфильтрованных или отсортированных товаров
$(".submit").click(function(){
    if ($(this).hasClass("active")) {
        new_page = true
        get_page(1,true);
    }
});

function get_page(page, new_page = false) {
    sorting_option = $("#Sorting-button").data("option")
    $.ajax({
        url: `/filter-option-page/`,
        type: "POST",
        data: {
            "sorting_option": selected_option.sorting_option,
            "page":           page,
            "query_page":     selected_option.query_page,
            "brand_page":     selected_option.brand_page,

            "min_price": selected_option.min_price,
            "max_price": selected_option.max_price,
            "Sizes":     selected_option.sizes,
            "Stock":     selected_option.stock,
            "Color":     selected_option.color,
            "Material":  selected_option.material,
            "Brand":     selected_option.brand,
            "Category":  selected_option.podcategory,
            "path": $(".ddfcs").attr("dlue"),
        },
        success: response => {
            let html = '';
            response.products.forEach(product => {
              html += '<li class="product">' +
                '<div class="img-product">' +
                '<a href="/product/' + product.uid + '"><img src="/media/' + product.img + '" alt=""></a>' +
                '</div>' +
                '<div class="product-down">' +
                '<div class="brand">' +
                '<img src="/media/' + product.brand + '" alt="">' +
                '</div>' +
                '<div class="name"> ' + product.podcategory + " " + product.name + '</div>' +
                '<div class="price"> ' + product.price + ' </div>' +
                '</div>' +
                '</li>';
            });
            
            if (!(/Mobi|Android/i.test(navigator.userAgent))) {
                if (new_page){
                    UpdatePaginator(response.new_pages)
                }
                ProductsList.html(html);
            } else {
                if (new_page){
                    UpdatePaginator(response.new_pages)
                    ProductsList.html(html);
                } else {
                    document.getElementById("product-list").insertAdjacentHTML("beforeend", html);
                }
            }
            $(".Center-brand p").text(`Кол-во товаров: ${response.count_products}`)
        },
        error: (xhr, status, error) => {
            console.error(error);
        }
    })
}

// функция фильтра по CSV цене плохо работает и плохо работает установление новых цен(новые цены всегда меняют старые )
function send_query(slide = false) {
    if ($('#itlast li.active').length > 0 || slide) {
        $(".top p").show();
        const options = {}; // Initialize options object
        $("#itlast li").each(function() {
            options[$(this).data("value")] = $(this).closest('.mli').attr("type");
        });
        const jsonData_options = JSON.stringify(options); // Convert options object to JSON string
        $.ajax({
            url: `/filter-option-count/`,
            type: "POST",
            data: {
                "options":   jsonData_options,
                "query_page":selected_option.query_page,
                "brand_page":selected_option.brand_page,
                "min_price": selected_option.min_price,
                "max_price": selected_option.max_price,
                "Sizes":     selected_option.sizes,
                "Stock":     selected_option.stock,
                "Color":     selected_option.color,
                "Material":  selected_option.material,
                "Brand":     selected_option.brand,
                "Category":  selected_option.podcategory,
                "path": $(".ddfcs").attr("dlue"),
            },
            success: response => {
                $("#itlast li").each(function() {
                    const txt = response.counts[$(this).data("value")];
                    if (parseInt(txt) > 0) {
                        $(this).find('.number').addClass('active');
                        $(this).find('.number h6').text(txt);
                        $(this).removeClass("sehide");
                    } else {
                        if (!$(this).hasClass("notselectable")) {
                            $(this).find('.number').removeClass('active');
                            $(this).addClass("sehide");
                        } else {
                            $(this).find('.number').removeClass('active');
                        }
                    }
                });
                if (response.count_show > 0) {
                    $(".submit").text(`Показать ${response.count_show}`);
                    $(".submit").addClass("active");
                } else {
                    $(".submit").text(`Не найдено`);
                    $(".submit").removeClass("active");
                }

                min_out = parseInt(response.min_price)
                max_out = parseInt(response.max_price)
                if (min_out != "No change"){
                    $("#slide_min").attr('placeholder', `От ${min_out}`);
                    $("#slide_min").attr('min', min_out);
                    $("#slide_max").attr('min', min_out);
                }
                if (max_out != "No change"){
                    $("#slide_max").attr('placeholder', `До ${max_out}`);
                    $("#slide_max").attr('max', max_out);
                    $("#slide_min").attr('max', max_out);
                }
                slidin()
            },
            error: (xhr, status, error) => {
                console.error(error);
            }
        });
    } else {
        $(".top p").hide();
        upperSlider.attr("min", defaultMin);
        lowerSlider.attr("min", defaultMin);
        upperSlider.attr("max", defaultMax);
        lowerSlider.attr("max", defaultMax);
        
        if (last_selected_min_price < parseInt(lowerSlider.val())) {
            if (last_selected_min_price > parseInt(lowerSlider.attr("min"))){
                LowerSet(parseInt(lowerSlider.attr("min")),false);
            } else {
                LowerSet(last_selected_min_price,false);
            }
        }

        if (last_selected_max_price > parseInt(upperSlider.val())) {
            if (last_selected_max_price > parseInt(upperSlider.attr("max"))){
                UpperSet(parseInt(upperSlider.attr("max")),false);
            } else {
                UpperSet(last_selected_max_price,false);
            }
        }
        
        slidin()
        $(".submit").text(`Применить`);
        $("#itlast li .number").removeClass("active");
        $("#itlast li").removeClass("sehide");
    }
}

// Click to option last attr
$(".attr.last li").click(function() {
    if (!$(this).hasClass("sehide")){
        let value      = $(this).data("value");
        let parentmli  = $(this).closest('.mli');
        let numberh6   = parentmli.find('.number.m h6').not('.number.m.copy h6');
        let conumberh6 = parentmli.find('.number.m.copy h6');
        let type_value = parentmli.prop("type"); // Тип = Цена, Бренд...
        
        if ($(this).hasClass("active")) { // Если опция уже активна уже есть
            $(this).removeClass("active"); // убираем актив
            numcount = parseInt(numberh6.text()) - 1; // уменьшаем число выбранных
            let Index = selected_option[type_value].indexOf(value); // убираем из выбранных эту опцию 
            if (Index !== -1) {
                selected_option[type_value].splice(Index, 1);
            }
        } else {
            $(this).addClass("active");
            numcount = parseInt(numberh6.text()) + 1;
            
            selected_option[type_value].push(value)
        }
        
        numberh6.text(numcount)
        conumberh6.text(numcount)
        if (numcount > 0) { // Добавляем число сколько выбранных в опции 
            numberh6.parent().addClass("active");
            conumberh6.parent().addClass("active");
        } else {
            numberh6.parent().removeClass("active");
            conumberh6.parent().removeClass("active");
        }
        clearTimeout(timer_sent);
        timer_sent = setTimeout(() => {
            if (type_value === "stock") {
                if ($(this).hasClass("active")) {
                    send_query(true)
                } else {
                    send_query(false)                    
                }
            } else {
                send_query()
            }
        },600);
    }
});

$(".backTomenu").click(() => {
    $(".mli input[type='checkbox']").prop("checked", false);
})


function ResetFunc() {
    ClearBrand();
    ClearPrice();
    $(".submit").removeClass("active");
    $("#itlast li").removeClass("active");
    $("#itlast li").removeClass("sehide");
    $("#itlast li .number").removeClass("active");
    $(".mli .number.m").removeClass("active");
    $(".mli.In_stock .box-last li").removeClass("active");
    $(".mli .number h6").text(0);
    selected_option = {
        "sizes":            [],
        "stock":            [],
        "color":            [],
        "material":         [],
        "brand":            [],
        "podcategory":      [],
        "sorting_option":   '',
        "min_price":        defaultMin,
        "max_price":        defaultMax,
    }
    $(".submit").text(`Применить`)
    $(".top p").hide();
} 

// Reset button
$(".top p").click(() => {ResetFunc()});
$(".reset_button").click(() => {ResetFunc()});


// Search Brand
$(".search_brand span").hide()
$('.search_brand input').on('input', function() {
    var inputVal = $(this).val().toLowerCase();
    if (inputVal.length < 1) {
        $(".search_brand span").hide()
    } else if ($("input").is(":hidden")) {
        $(".search_brand span").show()
    }
    $('#bjin ul').each(function() {
        var $ul = $(this);
        var $li = $ul.find('li');
        var hasVisibleChild = false;
        
        $li.each(function() {
            var brandValue = $(this).data('value').toLowerCase();
            if (brandValue.includes(inputVal)) {
                $(this).show();
                hasVisibleChild = true;
            } else {
                $(this).hide();
            }
        });
        // Если все элементы li скрыты, скрываем и сам элемент ul
        if (!hasVisibleChild) {$ul.hide();
        } else {$ul.show();}
    });
});

// Очистака результатов поиска и inputа
function ClearBrand() {
    $('.search_brand input').val('');
    $('#bjin ul li').show();
    $('#bjin ul').show();
    $(".top p").hide();
}
$('.search_brand span').on('click', ClearBrand);


// Range input for price
const lowerSlider = $('#slide_min'),lowerInput = $('#min_price'),
upperSlider = $('#slide_max'),upperInput = $('#max_price');
upperSlider.val(upperSlider.attr('max'));
const defaultMin = lowerSlider.attr("defaultMin")
const defaultMax = upperSlider.attr("defaultMax")

// Функия для сброса фильтров
function ClearPrice() { 
    lowerSlider.attr("min",defaultMin);lowerSlider.attr("max",defaultMax);
    upperSlider.attr("min",defaultMin);upperSlider.attr("max",defaultMax);
    lowerSlider.val(defaultMin);lowerInput.val(defaultMin);
    upperSlider.val(defaultMax);upperInput.val(defaultMax);
    slidin();
}

// Рисуем диапозон на input
function slidin() { 
    let lowerVal = parseInt(lowerSlider.val());
    let upperVal = parseInt(upperSlider.val());
    let max = lowerSlider.attr("max"),
        min = lowerSlider.attr("min");
    
    $('#range').css('width', (((upperVal - lowerVal) / (max - min)) * 100) + '%');
    $('#range').css('left', (((lowerVal - min) / (max - min)) * 100) + '%');// устанавливаем значения для #range
    upperInput.val(upperVal);
    lowerInput.val(lowerVal);
}
slidin();


// Функция при изменении range inputa Максимальной цены
UpperSlider = () => {
    let upperVal = parseInt(upperSlider.val());
    let lowerVal = parseInt(lowerSlider.val());
    if (upperVal < lowerVal + 100) { // отступ от правого
        if (lowerVal != lowerSlider.attr('min')) {
            lowerSlider.val(upperVal - 100);
            selected_option["min_price"] = last_selected_min_price = upperVal - 100
        }
    }
    slidin();
    
    selected_option["max_price"] = last_selected_max_price = upperVal
    clearTimeout(timer_sent);
    timer_sent = setTimeout(() => {
        send_query(true)
    },850);
}
// Функция при вводе number inputa Максимальной цены
UpperSet = (vvalue = upperInput.val(), refunction = true) => {
    let upperVal = parseInt(vvalue);
    upperSlider.val(upperVal); 
    if (upperVal-1 < lowerInput.val()) {
        lowerSlider.val(upperVal - 100);
        lowerInput.val(upperVal - 100)
        selected_option["min_price"] = last_selected_min_price = upperVal - 100
    }
    slidin();
    if (refunction != false){
        clearTimeout(timer_sent);
        timer_sent = setTimeout(() => {
            send_query(true)
            selected_option["max_price"] = last_selected_max_price = upperVal
        },850);
    }
}


// Функция при изменении range inputa Минимальной цены
LowerSlider = () => {
    let lowerVal = parseInt(lowerSlider.val());
    let upperVal = parseInt(upperSlider.val());
    if (lowerVal > upperVal - 101) {
        if (upperVal != upperSlider.attr('max')) {
            upperSlider.val(lowerVal + 100);
            selected_option["max_price"] = last_selected_max_price = lowerVal + 100
        }
    }
    slidin();

    clearTimeout(timer_sent);
    timer_sent = setTimeout(() => {
        send_query(true)
    },850);
    selected_option["min_price"] = last_selected_min_price = lowerVal
}
// Функция при вводе number inputa Минимальной цены
LowerSet = (vvalue = lowerInput.val(), refunction = true) => {
    let lowerVal = parseInt(vvalue);
    lowerSlider.val(lowerVal); 
    if (lowerVal+1 > upperSlider.val()) {
        upperSlider.val(lowerVal + 100);
        upperInput.val(lowerVal + 100)
        selected_option["max_price"] = last_selected_max_price = lowerVal + 100
    }
    slidin();
    if (refunction != false) {
        clearTimeout(timer_sent);
        timer_sent = setTimeout(() => {
            send_query(true)
            selected_option["min_price"] = last_selected_min_price = lowerVal
        },850);
    }
}

upperInput.on('change', UpperSet);
lowerInput.on('change', LowerSet);
upperSlider.on('input', UpperSlider);
lowerSlider.on('input', LowerSlider);

$(document).ready(() => {
    option_nav = $(".option-list").data("nav")
    if (option_nav){
        $("#itlast li").each(function() {
            if ($(this).data('value') === option_nav) {
                $(this).addClass("active");
            }
        });
    }
})