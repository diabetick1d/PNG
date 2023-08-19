from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("add_favorite/",                     views.add_favorite),
    path("remove_favorite/",                  views.remove_favorite),
    path("add_cart/",                         views.add_cart),
    path("remove_cart/",                      views.remove_cart),
    path("check_promo/",                      views.check_promo ),


    path("profile/",                          views.page_profile, name="profile"),
    path("favorite/",                         views.page_favorite, name="favorite"),
    path("cart/",                             views.page_cart, name="cart"),
    path("order/payment",                     views.payment),
    path("order/check",                       views.payment_get),
    path("return/get",                        views.add_return),
    path("return/update",                     views.update_return),
    
    
    path("profile/telegram_login",            views.telegram_login, name="telegram_login"),
    path("accounts/login/",                   views.page_profile_login),
    path("accounts/registration/<str:bonus_url>", views.page_profile_registration),
    path("logout/",                           auth_views.LogoutView.as_view(next_page='profile'), name='logout'),
]