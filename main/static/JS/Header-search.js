
const searchInput = $('#Header-search-input');
const results     = $('#results');

function HighLight(text, query) {
    const regex = new RegExp('('+query+')', 'gi');
    return text.replace(regex, '<span class="HighLight">$1</span>');
}

// function searchinput() {
//     const query = $('#Header-search-input').val();
//     const url = `/search/results/${encodeURIComponent(query)}`;
//     window.location.href = url;
// }

// $('.form-search-inline').submit(function(event) {
//     event.preventDefault();
//     searchinput();
// });

let timer_search
searchInput.on('input', function() {
    clearTimeout(timer_search);
    timer_search = setTimeout(function() {
        if (!(searchInput.val() === '' || searchInput.val() === " ")) {
            $.ajax({
                url: '/search/products/',
                type: 'POST',
            data: { query: searchInput.val() },
            success: function(data) {
                let html = '';
                for (let i = 0; i < data.results.length; i++) {
                    html += '<li class="list-group-item">' +
                    '<a href="/product/' + data.results[i].uid + '">' + HighLight(data.results[i].name, searchInput.val()) + '</a>' +
                    '</li>';
                }
                results.html(html);
            },
            error: function(xhr) {
                console.error('Request failed', xhr);
            }
            });
        } else {
            results.html('');
        }
    }, 350)
});
