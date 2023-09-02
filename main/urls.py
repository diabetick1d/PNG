from django.urls import path
from . import views

urlpatterns = [
    path("",                                views.page_home, name="home"),
    path("brands/",                         views.page_brands, name="brands"),

    path("productlist/shoe/<option>/<option_nav>",        views.product_list),
    path("productlist/cloths/<option>/<option_nav>",      views.product_list),
    path("productlist/bags/<option>/<option_nav>",        views.product_list),
    path("productlist/clocks/<option>/<option_nav>",      views.product_list),
    path("productlist/accessories/<option>/<option_nav>", views.product_list),
    path("productlist/cosmetics/<option>/<option_nav>",   views.product_list),
    path("productlist/technique/<option>/<option_nav>",   views.product_list),
    path("productlist/toys/<option>/<option_nav>",        views.product_list),
    path("productlist/sport/<option>/<option_nav>",       views.product_list),
    path("productlist/shoe",                              views.product_list),
    path("productlist/cloths",                            views.product_list),
    path("productlist/bags",                              views.product_list),
    path("productlist/clocks",                            views.product_list),
    path("productlist/accessories",                       views.product_list),
    path("productlist/cosmetics",                         views.product_list),
    path("productlist/technique",                         views.product_list),
    path("productlist/toys",                              views.product_list),
    path("productlist/sport",                             views.product_list),

    path("callback/",                        views.page_callback, name="callback"),
    path("support/",                        views.page_support, name="support"),
    path("filter-option-count/",            views.number_of_options),
    path("filter-option-page/",             views.get_filtered_products),

    path('search/products/',                views.search_products),
    path('search/results/',                 views.search_results),
    path("brands/search/",                  views.search_brand),
    path("brand_search/",                   views.search_brand_name, name='search_brand_name'),
    path("brand/products/<str:brand_query>",views.brand_results, name='brand_results'),

    path("product/<str:uid>",               views.product_detail),
]