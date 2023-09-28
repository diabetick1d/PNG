from django.urls import path
from . import views
from django.contrib.auth import views as auth_views

urlpatterns = [
    path("add_favorite/",                     views.add_favorite),
    path("remove_favorite/",                  views.remove_favorite),
    path("add_cart/",                         views.add_cart),
    path("remove_cart/",                      views.remove_cart),
    path("check_promo/",                      views.check_promo ),


    path("profile/<goto>",                    views.page_profile, name="profile_goto"),
    path("favorite/",                         views.page_favorite, name="favorite"),
    path("cart/",                             views.page_cart, name="cart"),
    path("order/payment",                     views.payment),
    path("order/check",                       views.payment_get),
    path("return/get",                        views.add_return),
    path("return/update",                     views.update_return),
    
    
    path("get-bonus/check/<str:BonusProds>&<str:product_uid>", views.bonus_chget),
    path("get-bonus/<str:BonusProds>&<str:product_uid>",       views.get_bonus),
    path("profile/",                                           views.page_profile, name="profile"),
    path("profile/first_login",                                views.first_login, name="first_login"),
    path("accounts/login/telegram_login",                             views.telegram_login, name="telegram_login"),
    path("accounts/login/",                                    views.page_profile_login),
    path("accounts/registration/<str:bonus_url>",              views.page_profile_registration),
    path("logout/",                                            auth_views.LogoutView.as_view(next_page='profile'), name='logout'),
]