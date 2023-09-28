function StopEvent(event){ event.preventDefault(); location.reload(false);}

// open so or fi
const FiltersForm   = $("#filter-form"),
      SortingForm   = $("#sorting-form"),
      FilterButton  = $("#Filter-button"),
      SortingButton = $("#Sorting-button"),
      ProductsList  = $("#product-list");

const lowerSlider = $('#slide_min'),
      lowerInput = $('#min_price'),
      upperSlider = $('#slide_max'),
      upperInput = $('#max_price');
const defaultMin = lowerSlider.attr("defaultMin"),
      defaultMax = upperSlider.attr("defaultMax");
let   Min = parseInt(lowerSlider.attr("min")),
      Max = parseInt(upperSlider.attr("max")),
      oldmax, oldmin;

// var previousWindowHeight = window.innerHeight;
// var previousScrollPosition = window.pageYOffset;
// if ((/mobile/i.test(navigator.userAgent) && window.innerWidth < 500)) { // Ебанная панелькак снизу у мобилок
//     $("#filter-form").addClass("open")
// } else {
//     $("#filter-form").removeClass("open")
// }
// window.addEventListener('resize', function() {
//     var currentWindowHeight = window.innerHeight;

//     if ((/mobile/i.test(navigator.userAgent) && window.innerWidth < 500)) {
//         if (currentWindowHeight < previousWindowHeight) {
//             $("#filter-form").addClass("open")
//         } else if (currentWindowHeight > previousWindowHeight) {
//             $("#filter-form").removeClass("open")
//         }
//     }
//     previousWindowHeight = currentWindowHeight;
// });
      
function SwitchFilter() { // При клике на фильтр  
    if (FiltersForm.hasClass("active")) {
        FiltersForm.removeClass("active");FilterButton.removeClass("active");
        BodyResScroll()
    } else {
        FiltersForm.addClass("active"); FilterButton.addClass("active");
        BodyStopScroll()
        if ((/mobile/i.test(navigator.userAgent) && window.innerWidth < 500)) {
            scrollToTop()
        }
    }
}
function RemoveFilter() { // Крестик у ui
    FiltersForm.removeClass("active");FilterButton.removeClass("active");
    BodyResScroll()
}

function SwitchSorting() { // При клике на сортировку 
    if (SortingForm.hasClass("active")) {
        SortingForm.removeClass("active");SortingButton.removeClass("active");
        BodyResScroll()
    } else {
        SortingForm.addClass("active");SortingButton.addClass("active");
        BodyStopScroll()
    }
}

function RemoveSorting() { // Крестик у ui
    SortingForm.removeClass("active");SortingButton.removeClass("active");
    BodyResScroll()
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

selected_option = {
    "sizes":          [],
    "stock":          [],
    "color":          [],
    "material":       [],
    "brand":          [],
    "podcategory":    [],
    "sorting_option": '',

    "min_price":      parseInt(lowerSlider.val()),
    "max_price":      parseInt(upperSlider.val()),

    "query_page": $("#filter-form").data("search"),
    "brand_page": $("#filter-form").data("brand"),
}

// Получение списка отфильтрованных или отсортированных товаров
$(".submit").click(function(){
    if ($(this).hasClass("active")) {
        new_page = true
        get_page(1,true);
        scrollToTop()
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
            
            if (!((/mobile/i.test(navigator.userAgent) && window.innerWidth < 500))) {
                if (new_page){
                    UpdatePaginator(response.new_pages)
                    currentPage = 1
                }
                ProductsList.html(html);
            } else {
                if (new_page){
                    UpdatePaginator(response.new_pages)
                    ProductsList.html(html);
                    currentPage = 1
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

function send_query(refresh = false) {
        const options = {}; 
        let topp      = false
        $("#itlast li").each(function() {
            options[$(this).data("value")] = $(this).closest('.mli').attr("type");

            if ($(this).hasClass("active")) {topp = true;}
            if (topp) {$(".top p").show();}
            else      {$(".top p").hide();}
        });
        const jsonData_options = JSON.stringify(options); // Конвертируем в JSON
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

                max = response.max_price
                min = response.min_price
                if (refresh){ // Если это первая загрузка или перезанрузка* всех фильтров
                    upperSlider.attr("value", response.max_price);
                    lowerSlider.attr("value", response.min_price);
                }
                if (min && min !== "No change" && typeof min == "number"){
                    oldmin = Min;
                    Min = min;
                    ChangeMinMax();
                }
                if (max && max !== "No change" && typeof max == "number"){
                    oldmax = Max;
                    Max = max;
                    ChangeMinMax();
                }
                slidin()
            },
            error: (xhr, status, error) => {
                console.error(error);
            }
        });
}
$(document).ready(function() {
    option_nav = $(".option-list").data("nav")
    if (option_nav){
        $("#itlast li").each(function() {
            if ($(this).data('value') === option_nav) {
                $(this).addClass("active");
            }
        });
    }

    $(".attr.last li").each(function() {
        let value      = $(this).data("value");
        let parentmli  = $(this).closest('.mli');
        let numberh6   = parentmli.find('.number.m h6').not('.number.m.copy h6');
        let conumberh6 = parentmli.find('.number.m.copy h6');
        let type_value = parentmli.prop("type");                    // Тип = Цена, Бренд...
        
        if ($(this).hasClass("active")) {                           // Если опция уже активна уже есть
            selected_option[type_value].push(value)
            numberh6.text(1)
            conumberh6.text(1)

            numberh6.parent().addClass("active");
            conumberh6.parent().addClass("active");
        }
    })
    send_query(true)
    $("#slide_min")
})

// Click to option last attr
$(".attr.last li").click(function() {
    if (!$(this).hasClass("sehide")){
        let value      = $(this).data("value");
        let parentmli  = $(this).closest('.mli');
        let numberh6   = parentmli.find('.number.m h6').not('.number.m.copy h6');
        let conumberh6 = parentmli.find('.number.m.copy h6');
        let type_value = parentmli.prop("type");                    // Тип = Цена, Бренд...
        
        if ($(this).hasClass("active")) {                           // Если опция уже активна уже есть
            $(this).removeClass("active");                          // убираем актив
            numcount = parseInt(numberh6.text()) - 1;               // уменьшаем число выбранных
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
        if (numcount > 0) {                                         // Добавляем число сколько выбранных в опции 
            numberh6.parent().addClass("active");
            conumberh6.parent().addClass("active");
        } else {
            numberh6.parent().removeClass("active");
            conumberh6.parent().removeClass("active");
        }
        clearTimeout(timer_sent);
        timer_sent = setTimeout(() => {
            if (type_value === "stock") {
                send_query()                    
            } else {
                send_query()
            }
        },600);
    }
});

$(".backTomenu").click(() => {
    $(".mli:not(.not-absolute) input[type='checkbox']").prop("checked", false);
})


function ResetFunc() {
    ClearBrand();
    // ClearPrice();
    $(".submit").removeClass("active");
    $("#itlast li").removeClass("active");
    $("#itlast li").removeClass("sehide");
    // $("#itlast li .number").removeClass("active");
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
    send_query(true);
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
}
$('.search_brand span').on('click', ClearBrand);


// Функия для сброса фильтров
// function ClearPrice() { 
//     lowerSlider.attr("min",defaultMin);lowerSlider.attr("max",defaultMax);
//     upperSlider.attr("min",defaultMin);upperSlider.attr("max",defaultMax);
//     lowerSlider.val(defaultMin);lowerInput.val(defaultMin);
//     upperSlider.val(defaultMax);upperInput.val(defaultMax);
//     slidin();
// }

function ChangeMinMax(){
    upperSlider.attr("min",Min);lowerSlider.attr("min",Min);
    upperInput.attr("min",Min);lowerInput.attr("min",Min);

    upperSlider.attr("max",Max);lowerSlider.attr("max",Max);
    upperInput.attr("max",Max);lowerInput.attr("max",Max);

    let maxvalue = parseInt(upperInput.val()), minvalue = parseInt(lowerInput.val());
    if (maxvalue > Max || maxvalue < Min){           // Если старые значения не допустимы после обновления max или min
        upperInput.val(Max)                          // то ставит новое значение под новые max или min
    }     
    if (minvalue > Max || minvalue < Min){
        lowerInput.val(Max)
    }

    if (oldmin == minvalue){                         // Если значение было максимальным или минимальным после обновления max или min
        lowerInput.val(Min)                     // то ставит новое значение под новые max или min
        lowerSlider.val(Min)
        slidin()
    }

    if (oldmax == maxvalue){
        upperInput.val(Max)
        upperSlider.val(Max)
        slidin()
    }

    padd = parseInt((upperSlider.attr("max") - upperInput.attr("min")) / 100 * 5)
}

// Рисуем диапозон на range input
function slidin() { 
    valuemax = parseInt(upperSlider.val());valuemin = parseInt(lowerSlider.val());
    $('#range').css('width', (((valuemax - valuemin) / (Max - Min)) * 100) + '%');
    $('#range').css('left',  (((valuemin - Min) / (Max - Min)) * 100) + '%');
}
slidin();


// Функция при изменении range inputa 

function UpperSlider(){
    valuemax = parseInt(upperSlider.val()), valuemin = parseInt(lowerSlider.val())
    if (valuemax - (padd + 5) < valuemin) {             // Если одно больше или меньше другого то
        if (valuemax < (Min + (padd + 5))){                  // меняем недопустимое значение
            valuemin = Min
            valuemax = Min + padd
            upperSlider.val(valuemax)
        } else {
            valuemin = valuemax - padd
        }
        lowerSlider.val(valuemin)                       // устанавляваем для противоположного допустимое значения
        lowerInput.val(valuemin)                        // устанавливаем для противоположного допустимое значения
        selected_option["min_price"] = valuemin         // обновляем значение в словаре фильтрации значение для противоположного
    }
    selected_option["max_price"] = valuemax // обновляем значение в словаре фильтрации
    upperInput.val(valuemax)                // Устанавливаем значение слайдер => инпут

    
    clearTimeout(timer_sent);               // таймер на отправку запроса на фильтрацию
    timer_sent = setTimeout(() => {
        send_query()
    },550);
    slidin()                                // Рисуем диапозон
}
function LowerSlider(){
    valuemax = parseInt(upperSlider.val()), valuemin = parseInt(lowerSlider.val())
    if (valuemin + (padd + 5) > valuemax) {
        if (valuemin > (Max - (padd + 5))){                  // меняем недопустимое значение
            valuemin = Max - padd
            valuemax = Max
            lowerSlider.val(valuemin)
        } else {
            valuemax = valuemin + padd
        }
        upperSlider.val(valuemax)
        upperInput.val(valuemax)
        selected_option["max_price"] = valuemax
    }
    selected_option["min_price"] = valuemin
    lowerInput.val(valuemin)
    
    clearTimeout(timer_sent);
    timer_sent = setTimeout(() => {
        send_query()
    },550);
    slidin()
}
// Функция при вводе number inputa 

function UpperSet(){
    let valuemax = parseInt(upperInput.val()), valuemin = parseInt(lowerInput.val());
    if (valuemax > Max){
        upperInput.val(Max)
        valuemax = Max
    } else if (valuemax < Min){
        upperInput.val(Min + padd)
        valuemax = Min + padd
    } else if (valuemax - (padd + 5) > valuemin) {
        valuemin       = valuemax - padd
        lowerInput.val(valuemin)
        lowerSlider.val(valuemin)
        selected_option["min_price"] = valuemin
    } 
    selected_option["max_price"] = valuemax
    upperSlider.val(valuemax)

    clearTimeout(timer_sent);
    timer_sent = setTimeout(() => {
        send_query()
    },550);
    slidin()
}
function LowerSet(){
    let valuemax = parseInt(upperInput.val()), valuemin = parseInt(lowerInput.val());
    if (valuemin < Min){
        lowerInput.val(Min)
        valuemin = Min
    } else if (valuemin > Max){
        lowerInput.val(Max - padd)
        valuemin = Max - padd
    } else if (valuemin - (padd + 5) > valuemax) {
        valuemax       = valuemin - padd
        upperInput.val(valuemax)
        upperSlider.val(max_price)
        selected_option["min_price"] = valuemax
    } 
    selected_option["min_price"] = valuemin
    lowerSlider.val(valuemin)

    clearTimeout(timer_sent);
    timer_sent = setTimeout(() => {
        send_query()
    },550);
    slidin()
}

upperInput.on('change', UpperSet);
lowerInput.on('change', LowerSet);
upperSlider.on('input', UpperSlider);
lowerSlider.on('input', LowerSlider);
