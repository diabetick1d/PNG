
// open so or fi
const FiltersForm = $("#filter-form");
const SortingForm = $("#sorting-form");

const FilterButton = $("#Filter-button");
const SortingButton = $("#Sorting-button");

function SwitchFilter() {
    if (FiltersForm.hasClass("active")) {
        FiltersForm.removeClass("active");
        FilterButton.removeClass("active");
    } else {
        FiltersForm.addClass("active");
        FilterButton.addClass("active");
    }
}
function RemoveFilter() {
    FiltersForm.removeClass("active");
    FilterButton.removeClass("active");
}

function SwitchSorting() {
    if (SortingForm.hasClass("active")) {
        SortingForm.removeClass("active");
        SortingButton.removeClass("active");
    } else {
        SortingForm.addClass("active");
        SortingButton.addClass("active");
    }
}
function RemoveSorting() {
    SortingForm.removeClass("active");
    SortingButton.removeClass("active");
}

$(document).ready(function() {
    // Click to option last attr
    $("#itlast li").click(function() {
        if ($(this).hasClass("active")) {
            $(this).removeClass("active");
        } else {
            $(this).addClass("active");
        }
    });

    let timer_brand_query
    let img = new Image();
    img.src = "/static/img/product-list/star_black.svg";
    $('.search_brand input').on('keyup', function() {
        Query = $(this).val();
        if (Query != '') {
            clearTimeout(timer_brand_query);
            timer_brand_query = setTimeout(() => {
                html = ""
                $.post("/brand_search/", 
                {
                    'query': Query
                },
                function(data){
                    if (data.results){
                        for (let [key, value] of Object.entries(data.results)) {
                            if (value.length > 0){
                                html += '<ul class="br_in"><h4>'+ key +'</h4>'
                                for (let i = 0; i < value.length; i++) {
                                    html += '<li data-value="'+ value[i] +'"><div class="star"><img src="' + img.src + '" alt=""></div><h3>'+ value[i] +'</h3></li>'
                                }
                                html += '</ul>'
                            }
                        }
                        $('#brand_results').html(html)
                        $('#brand_results').removeClass('active')
                        $('#brand_jin').addClass('active')
                    }
                });
            },400);
        } else {
            $('#brand_results').addClass('active')
            $('#brand_jin').removeClass('active')
        }
    });
    lowerSlider = $('#slide_min');
    upperSlider = $('#slide_max');
    lowerInput = $('#min_price');
    upperInput = $('#max_price');
    upperSlider.val(upperSlider.attr('max'));
    lowerVal = parseInt(lowerSlider.val());
    upperVal = parseInt(upperSlider.val());
  
    function slidin() {
        let interval = (upperVal - lowerVal) / lowerSlider.attr('max') * 100;
        let position = (lowerVal / lowerSlider.attr('max')) * 98;
        $('#range').css('width', interval + '%');
        $('#range').css('margin-left', position + '%');
        upperInput.val(upperVal.toString());
        lowerInput.val(lowerVal.toString());
    }
    slidin();
    
    upperInput.on('input', function(){
        let value = $(this).val();
        if (parseInt(value) > parseInt($(this).attr('max'))) {
            value = $(this).attr('max')
        } else if (parseInt(value) < parseInt($(this).attr('min')) || isNaN(parseInt(value))) {
            value = $(this).attr('min')
        }
        upperSlider.val(value); UpperSlider();
    })

    lowerInput.on('input', function(){
        let value = $(this).val();
        if (parseInt(value) > parseInt($(this).attr('max'))) {
            value = $(this).attr('max')
        } else if (parseInt(value) < parseInt($(this).attr('min')) || isNaN(parseInt(value))) {
            value = $(this).attr('min')
        }
        lowerSlider.val(value); LowerSlider();
    })

    function UpperSlider() {
        lowerVal = parseInt(lowerSlider.val());
        upperVal = parseInt(upperSlider.val());
        if (upperVal < lowerVal + 20) {
            lowerSlider.val(upperVal - 20);
            
            if (lowerVal == lowerSlider.attr('min')) {
                upperSlider.val(20);
            }
            lowerVal = parseInt(lowerSlider.val());
        }
        slidin();
    }
    function LowerSlider() {
        lowerVal = parseInt(lowerSlider.val());
        upperVal = parseInt(upperSlider.val());
        if (lowerVal > upperVal - 20) {
            upperSlider.val(lowerVal + 20);
            
            if (upperVal == upperSlider.attr('max')) {
                lowerSlider.val(parseInt(upperSlider.attr('max')) - 20);
            }
            upperVal = parseInt(upperSlider.val());
        }
        slidin();
    };

    upperSlider.on('input', UpperSlider);
    lowerSlider.on('input', LowerSlider);
});




// /* filtering */
// const touchfi = document.querySelector(".dropdown-fi #touch-fi");
// const navfi   = document.querySelector(".dropdown-fi nav");

// var countfi    = navfi.querySelectorAll(".label-input").length
// var vaheight   = parseInt(getComputedStyle(navfi).getPropertyValue('--vaheight'),10)
// document.documentElement.style.setProperty('--heightfi', vaheight*countfi + 'px');

// $(".dropdown-fi .label-touch").on("click", function() {
//     if ($(this).hasClass('active')) {
//         $(this).removeClass("active");
//         $(".filter-option").removeClass("active");
//         $(".slide-filter .label-input").removeClass("active");
//     } else {
//         $(this).addClass("active");
//         $('.slide-filter .label-input').on('click', function() {
//             var value = $(this).data('value');
//             if ($(this).hasClass('active')) {
//                 $(this).removeClass("active");
//                 $('.filter-option.' + value).removeClass("active");
//             } else {
//                 $('.filter-option:not(.' + value + ')').removeClass("active");
//                 $('.slide-filter .label-input').removeClass("active");
//                 $('.filter-option.' + value).addClass("active");
//                 $(this).addClass("active");
//             }
//         });
//     };
// });

// /* sorting */
// const touchso = document.querySelector(".dropdown-so #touch-so");
// const labelso = document.querySelector(".dropdown-so .label-touch");
// const navso   = document.querySelector(".dropdown-so nav");

// var countso   = navso.querySelectorAll(".slide-sorting li").length
// document.documentElement.style.setProperty('--heightso',  vaheight*countso + 'px');

// labelso.addEventListener("click", function() {
//     if (touchso.checked) {
//         labelso.classList.remove("active");
//     } else {
//         labelso.classList.add("active");
//     };
// });
