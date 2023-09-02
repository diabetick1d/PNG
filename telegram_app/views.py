from django.shortcuts import render, redirect
from django.contrib.auth import login
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from telebot.types import InlineKeyboardMarkup, InlineKeyboardButton

from django.core.exceptions import ObjectDoesNotExist
from django.contrib.auth import get_user_model
from main.auth_backends import CustomUserModelBackend

from main import models as MAINmodels

from django.contrib.auth.decorators import login_required
from . import forms, models
import json
from django.http import JsonResponse
import telebot
from main.views import separate, unseparate, ProcesPrice
from PNG import settings

User = get_user_model()
def telegram_login(request,url_back=False):
    # telegram_hash       = request.GET.get('hash')
    # telegram_auth_date  = request.GET.get('auth_date')
    telegram_id         = int(request.GET.get('id'))
    telegram_username   = request.GET.get('username')
    bonus_url           = request.GET.get('bonus_url',None)

    try:
        user = User.objects.get(uid=telegram_id)
        print(f"Вход пользователя:\n{user}")
    except ObjectDoesNotExist:
        try:
            button_web          = InlineKeyboardButton("Наш сайт", url=settings.SITE_URL)
            button_support      = InlineKeyboardButton("Поддержка", callback_data="support")
            notification_button = InlineKeyboardButton('Уведомления', callback_data='notification')
            reply_markup_main   = InlineKeyboardMarkup([[button_web], [notification_button,button_support]])
        except:
            print("Eror: telegram_data")
        if bonus_url and bonus_url != 'None':
            User.objects.create(uid=telegram_id, username=telegram_username, up_to_politic=False, bonus=User.objects.get(bonus_reference=str(bonus_url)))
        else:
            User.objects.create(uid=telegram_id, username=telegram_username, up_to_politic=False, bonus=None)
        print(f"Регистрация нового пользователя:\n - username:{telegram_username} - id: {telegram_id}")
        user = User.objects.get(uid=telegram_id)

        # Поприветствовать нового пользователя в телеграмм

        bot = telebot.TeleBot(token=settings.TELEGRAM_BOT_TOKEN)
        bot.send_message(chat_id=telegram_id, text="Добро пожаловать, это помощник PNGbot.\nЗдесь будут уведомления о ваших заказах, а так же вы можете связаться с поддержкой.",reply_markup=reply_markup_main)


    backend = CustomUserModelBackend()
    user = backend.authenticate(request, uid=telegram_id)

    # Авторизация пользователя в Django
    login(request, user, backend='main.auth_backends.CustomUserModelBackend')
    if url_back:
        return redirect(url_back)
    else:
        return redirect('/profile/')

def page_profile_registration(request,bonus_url=None):
    return render(request, 'main/profile-login.html', {'bonus_url': bonus_url})
def page_profile_login(request):
    return render(request, 'main/profile-login.html')


STATUS_CHOICES_DICT = {
    "ordered":              "Заказано",
    "sent":                 "Отправлено",
    "delivered_in_russian": "Доставлено в Россию",
    "in_stock":             "На складе",
    "sent_from_stock":      "Отправлено со склада",
    "delivered_to_point":   "Доставлено в пункт",
    "received ":            "Получено"
}

RETURN_CHOICES_DICT = {
    "return_1": "Возврат",
    "return_2": "Оформление возврата",
    "return_3": "Возврат оформлен",
}

@login_required 
def page_profile(request):
    if request.method == 'POST':
        form = forms.UserPersonalForm(request.POST, instance=request.user)
        if form.is_valid():
            form.save()
            request.user.up_to_politic = True
            request.user.save()
            return redirect('profile')
    else:
        form = forms.UserPersonalForm(instance=request.user)
        carts = models.Order.objects.filter(client=request.user.uid)
        to_cart = [
            {
                'id':             cart.uid,
                'number_order':   cart.number_order,
                'status':         STATUS_CHOICES_DICT[cart.status_order],
                'tracknumber':    cart.tracknumber,

                'type_delivery':  cart.type_delivery,
                'first_name':     cart.first_name,
                'last_name':      cart.last_name,
                'surname':        cart.surname,

                'phone':          cart.number_phone,
                'address':        cart.adress,
                'delivery_point': cart.delivery_point,

                'summ_price':     cart.summ_price,
                'data_order':     cart.data_order,
                'products':       [
                    {
                        'id':    product["uid"],
                        'name':  product["name"],
                        'brand': product["brand"],
                        'size':  product["size"],
                        'img':   product["img"],
                        'price': product["price"],
                    } for product in json.loads(cart.cart_order)
                ] 
            } for cart in carts
        ]
        returns = models.Returns.objects.filter(client=request.user.uid)
        to_returns = [
            {
                'id':             ret.uid,
                'number_order':   ret.number_order,
                'status':         RETURN_CHOICES_DICT[ret.status_return],
                'form':           forms.ReturnsForm(instance=ret),

                'summ_price':     ret.summ_price,
                'data_order':     ret.data_order,
                'products':       [
                    {
                        'id':    product["uid"],
                        'name':  product["name"],
                        'brand': product["brand"],
                        'size':  product["size"],
                        'img':   product["img"],
                        'price': product["price"],
                    } for product in json.loads(ret.cart_return)
                ] 
            } for ret in returns
        ]

    return render(request, 'main/profile.html', {'form': form,"carts": to_cart, "returns": to_returns, "userbonus": (request.user.bonus_number if request.user.bonus_number else 0), "domen": settings.SITE_URL})


@csrf_exempt
def add_favorite(request):
    if request.method == 'POST':
        product_uid = request.POST.get('uid')
        try:
            user = request.user
        except:
            return JsonResponse({'success': False, 'message': 'Пользователь не авторизован.'})
        try:
            if product_uid not in user.favorite:
                user.favorite.append(product_uid)
                user.save()
                response = {'success': True, "option": "add"}
            else:
                try:
                    user.favorite.remove(product_uid)
                    user.save()
                    response = {'success': True, "option": "remove"}
                except Exception as e:
                    response = {'success': False, 'message': 'Товар не удалось убрать из избранного.', 'error': str(e)}
        except Exception as e:
            response = {'success': False, 'message': 'Товар не удалось добавить в избранное.', 'error': str(e)}
        return JsonResponse(response)


@csrf_exempt
def add_cart(request):
   if request.method == 'POST':
        try:
            user = request.user
        except:
            return JsonResponse({'success': False, 'message': 'Пользователь не авторизован.'})
        
        try:
            product_size  = request.POST.get('size')
            product_price = request.POST.get('price')
            product_uid   = request.POST.get('uid')
            product       = f"{product_uid}#{product_size}"
        
        
            if product not in user.cart:
                user.cart[product] = product_price
                user.save()
                return JsonResponse({'success': True, "option": "add"})
            else:
                del user.cart[product]
                user.save()
                return JsonResponse({'success': True, "option": "remove"})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})



@csrf_exempt
def remove_cart(request):
    if request.method == 'POST':
        product_uid = request.POST.get('uid')
        user        = request.user
        product_size = str(request.POST.get('size')).split(" eu")[0]
        product_uid  = request.POST.get('uid')
        product      = f"{product_uid}#{product_size}"
        try:
            del user.cart[product]
            user.save()
            response = {'success': True}          
        except Exception as e:
            if (e == product):
                response = {'success': False, 'message': 'Товар уже убран из корзины.'}
            else:
                response = {'success': False, 'message': 'Товар не удалось убрать из корзины.', 'error': str(e)}
        return JsonResponse(response)
    
@csrf_exempt
def remove_favorite(request):
    if request.method == 'POST':
        product_uid = request.POST.get('uid')
        user = request.user
        if product_uid in user.favorite:
            try:
                user.favorite.remove(product_uid)
                user.save()
                response = {'success': True}
            except Exception as e:
                response = {'success': False, 'message': 'Товар не удалось убрать из избранного.', 'error': str(e)}
        else:
            response = {'success': False, 'message': 'Товар уже убран из избранного.'}
        return JsonResponse(response)

@login_required 
def page_favorite(request):
    raw_favorites = MAINmodels.Product.objects.filter(uid__in=request.user.favorite)

    favorites = [{
        'uid':   product.uid,
        'name':  product.name,
        'brand': str(product.brand.font),
        'img':   str(product.image1),
        'min_price': ProcesPrice(product.min_price),
    } for product in raw_favorites]

    return render(request, "main/favorite.html", {"favorites": favorites})

@csrf_exempt
def check_promo(request):
    promo = request.POST.get('promocode')
    try:
        promocode = models.Promocode.objects.get(promocode=promo)
        if promocode and promocode.promocode not in request.user.used_promo:
            price = promocode.price
            response = {'success': True, 'price': price}
            return JsonResponse(response)
        else:
            response = {'success': False, 'message': 'Такого промокода уже использован'}
            return JsonResponse(response)
    except:
        response = {'success': False, 'message': 'Такого промокода нету'}
        return JsonResponse(response)

# Сюда за кидываем только инфу о товаре и получаем uid (через submit not js) товаров что были выбраны.
@login_required 
def page_cart(request):
    user_cart = request.user.cart
    user      = request.user
    cart      = []

    for i in user_cart.keys():
        Key, Size = i.split('#')
        price = user_cart[i]
        product = MAINmodels.Product.objects.get(uid=Key)
        prd_price = unseparate(json.loads(product.prices)[Size]["price"])
        if int(unseparate(user_cart[i])) < int(prd_price):
            user.cart[i] = prd_price
            user.save()
            price        = prd_price

        try:
            count = (json.loads(product.prices))[Size]["count"]
        except:
            count = "-"
        if price == '0' or price == 0 or price == "-" or count == "0" or count == 0:
              cp = 0
        else: cp = 1
        cart.append({
            'uid':       product.uid,
            'name':      product.name,
            'brand':     str(product.brand.font),
            'brandtext': str(product.brand),
            'img':       str(product.image1),
            'count':     cp,
            'size':      f"{Size} eu" if product.category == "shoe" else Size,
            'price':     price,
            'priceint':  unseparate(price) if price != '-' else price,
        })
    return render(request, "main/cart.html", {"cart": cart})

# Здесь мы получаем uid товаров и добавляем в список при оплате чисто на показ.
@login_required
def payment(request):
    user = request.user
    cart = user.cart
    
    uid_list   = request.POST.getlist('uid[]')
    promocode  = request.POST.get('promocode', None)
    summ_price = 0
    products   = []

    if  promocode:
        try:
            promocode   = models.Promocode.objects.get(promocode=promocode)
            promoprice  = int(unseparate(promocode.price))
        except:
            promocode   = ''
            promoprice  = 0
    else:
        promoprice  = 0

    for i in uid_list:
        ps       = i.split(' ')[0]
        size     = i.split('#')[1]
        uid      = ps.split('#')[0]
        onl_size = size.split(" ")[0]
        cartps    = cart[ps]
        product   = MAINmodels.Product.objects.get(uid=uid)
        prd_price = int(json.loads(product.prices)[onl_size]["price"])
        if prd_price != 0 or prd_price != '-' or prd_price != '0' or cartps != '-':
                price      = unseparate(cartps) - promoprice
                if price < 0: price = 0
                pricesepar = separate(price)
                products.append({
                    'uid':   uid,
                    'size':  size,
                    'price': pricesepar,
                    'img':   str(product.image1),
                    'brand': product.brand,
                    'name':  product.name,
                    'url':   product.url,
                })
                summ_price += price
        else:
            uid_list.remove(i)

    if  summ_price < 0:
        summ_price = 0

    info_user = {
        "type":         user.base_type_deliver,
        "adress":       user.base_adress,
        "delivery_point":  user.base_delivery_point,
        "number_phone": user.base_number_phone,
        "first_name":   user.first_name,
        "last_name":    user.last_name,
        "surname":      user.surname
    }
    response = {
        'products':     products,
        'summ_price':   summ_price,
        'deliver_info': info_user,
        'count':        len(uid_list),
        'promocode':    promocode,
        'uid_list':     json.dumps(uid_list,ensure_ascii=False)
    }
    return render(request, 'main/payment.html', response)

def payment_get(request):
    ftype_delivery  = request.POST.get('type_delivery')
    first_name      = request.POST.get('first_name')
    last_name       = request.POST.get('last_name')
    surname         = request.POST.get('surname')
    number_phone    = request.POST.get('number_phone')
    adress          = request.POST.get('adress')
    delivery_point  = request.POST.get('delivery_point')
    promocode       = request.POST.get('promocode', None)
    
    user            = request.user
    summ_price      = 0

    if  ftype_delivery == "true":
        type_delivery = "Почта России"
    else: 
        type_delivery = "СДЭК"

    if  promocode:
        try:
            promocode = models.Promocode.objects.get(promocode=promocode)
            try: 
                promoprice = int(unseparate(promocode.price))
            except: 
                promoprice = int(promocode.price)

            if  promocode.count > 0 and (promocode.promocode not in request.user.used_promo):
                promocode.count -= 1
                promocode.save()
                user.used_promo.append(promocode.promocode)
                user.save(update_fields=['used_promo'])
        except:
            promocode   = ''
            promoprice  = 0
    else:
        promoprice  = 0


    products = json.loads(request.POST.get('products'))

    if  user.bonus:
        usera = user.bonus
        usera.bonus_number += len(json.loads(products))
        usera.save(update_fields=['bonus_number'])

    cart_products = []
    user_cart = request.user.cart
    try:
        for product in products:
            uid_cart   = product.split('#')[0]
            size_cart  = product.split('#')[1]
            onl_size   = product.split(" ")[0]
            
            producta    = MAINmodels.Product.objects.get(uid=uid_cart)
            price       = unseparate(user_cart[onl_size])
            summ_price += price - promoprice
            cart_products.append({
                'uid':           producta.uid,
                'url':           producta.url,
                'name':          producta.name,
                'brand':         producta.brand.name,
                'img':           str(producta.image1),
                'size':          size_cart,
                'price':         price,
            })

        order = models.Order.objects.create(
            first_name     = first_name,
            last_name      = last_name,
            surname        = surname,
            number_phone   = number_phone,
            adress         = adress,
            delivery_point = delivery_point,
            cart_order     = json.dumps(cart_products),
            client         = user.uid,
            type_delivery  = type_delivery,
            summ_price     = summ_price,
            promocode      = promocode,
        )
        response = {
            'status':    'success',
            'id_order':  order.number_order,
        }
    except Exception as e:
        response = {
            'status': 'fail',
            'error': str(e)
        }
    return JsonResponse(response)

@csrf_exempt
def add_return(request):
    if request.user.is_superuser:
        data         = json.loads(request.body)
        uid_products = json.loads(data['uid_list'])
        uid_order    = data['uid_order']
        products     = []
        summ_price   = 0

        for k, v in uid_products.items():
            product = MAINmodels.Product.objects.get(uid=k)
            products.append({
                'uid':   product.uid,
                'name':  product.name,
                'brand': product.brand.name,
                'img':   str(product.image1),
                'price': v["price"],
                'size':  v["size"],
                'url':   v["url"],
            })
            summ_price += unseparate(v["price"]) 

        if request.user.bonus:
            usera = request.user.bonus
            usera.bonus_number -= len(json.loads(products))
            usera.save()

        order = models.Order.objects.get(uid=uid_order)

        try:
            models.Returns.objects.create(
                number_order = order.number_order,
                promocode    = order.promocode,
                cart_return  = json.dumps(products),
                summ_price   = summ_price,
                client       = order.client,
                data_order   = order.data_order
            )
            return JsonResponse({'success': True})
        except Exception as e:
            return JsonResponse({'success': False, 'error': str(e)})

def update_return(request):
    uid        = request.POST.get('uid')
    card_number = request.POST.get('card_number')
    bank       = request.POST.get('bank')
    name       = request.POST.get('name')

    try:
        return_obj = models.Returns.objects.get(uid=uid)
        if return_obj.client == request.user.uid:
            return_obj.card_number   = card_number
            return_obj.bank          = bank
            return_obj.name          = name
            return_obj.status_return = "return_2"
            return_obj.save()
        return JsonResponse({'success': True})
    except Exception as e:
        return JsonResponse({'success': False, 'error': str(e)})