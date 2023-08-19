const spansizechart     = document.querySelector(".size-chart span");
const overlayfull       = document.querySelector('.overlay-full-z5');
const sizechart         = document.querySelector('.size-chart-box');
const closechartButton  = document.querySelector('.close-sizechart');

function Removesizechart() {
    sizechart.classList.remove('active');
    overlayfull.classList.remove('active');
}

function Addsizechart() {
    sizechart.classList.add('active');
    overlayfull.classList.add('active');
}

spansizechart.addEventListener('click', function() {
    Addsizechart()
});

closechartButton.addEventListener('click', function() {
    Removesizechart()
});

overlayfull.addEventListener('click', function() {
    Removesizechart()
});