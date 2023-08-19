const ques = document.querySelectorAll(".question-a")

$(document).ready(function(){
    $('.safety button').prop('checked', true);
});

ques.forEach(el =>{ 
    var button  = el.querySelector("input[type=checkbox]");
    var text    = el.querySelector(".text-question");
    var label   = el.querySelector("label");
    
    function activate() {
        if (button.checked) {
            text.classList.remove("active")
            label.classList.remove("active")
        } else {
            text.classList.add("active")
            label.classList.add("active")
        }
    };
    
    label.addEventListener("click", activate);
});

function openhelp(el) {
    var element = document.querySelector(el);

    var text    = element.querySelector(".text-question");
    var label   = element.querySelector("label");

    text.classList.add("active")
    label.classList.add("active")
}