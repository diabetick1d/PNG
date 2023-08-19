import json
import requests
from . import models
from django.http import JsonResponse
from django.shortcuts import render
from django.views.decorators.csrf import csrf_exempt
from django.core.paginator import Paginator
from django.db.models import Q
from eav.models import Attribute, Value

def BrandLetter():
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    resultSort = {}
    for letter in letters:
        brands = models.Brand.objects.filter(name__startswith=letter).order_by('name')
        if brands:
            resultSort[letter] = brands 
    return resultSort

def separate(number):
    if str(number).isdigit():
        reversed_str = str(number)[::-1]
        separated_str = '.'.join(reversed_str[i:i+3] for i in range(0, len(reversed_str), 3))
        return separated_str[::-1]
    else:
        return number
    
def ProcesPrice (price):
    if price > 0:
        return separate(price) + " ₽"
    else:
        return "-"

def unseparate(number):
    if isinstance(number, int):
        return number
    else:
        number = str(number).replace('.', '')
        return int(number)

def page_home(request):
    HomePages = models.HomePageProduct.objects.all()
    return render(request, "main/home.html", {"HomePages": HomePages})

def page_brands(request):
    queryset    = models.Brand.objects.all()
    compilation = models.Brand.objects.order_by("rarity")  

    return render(request, 'main/brands.html', {'brands': queryset, "compilation": compilation, "resultSort": BrandLetter})

def page_support(request):
    return render(request, "main/support.html")

from random import sample
def product_detail(request, uid):
    user = request.user
    product       = models.Product.objects.get(uid=uid) 
    prices_result = {}
    prices = json.loads(product.prices)
    if request.user.is_authenticated:
        usercart = True
        for key,value in prices.items():
            prices_result[key] = [((separate(value["price"])) if value["count"] > 0 else "-"), (True if str(product.uid) + '#' + key in user.cart else False)]
    else: 
        usercart = False
        for key,value in prices.items():
            prices_result[key] = [((separate(value["price"])) if value["count"] > 0 else "-"), False]   

    dict_recommendation = json.loads(product.Recomendation)
    shuffle_products = { key: dict_recommendation[key] for key in sample(list(dict_recommendation.keys()), min(len(dict_recommendation), 8))[:4]}
    shuffle_products_2 = { key: dict_recommendation[key] for key in sample(list(dict_recommendation.keys()), min(len(dict_recommendation), 8))[4:]}
    # if len(shuffle_products_2.keys()) < 2:
    #     shuffle_products_2 = None

    return render(request, 'main/product.html', {
        "product":      product, 
        "prices":       prices_result,
        "min_price":    ProcesPrice(product.min_price),
        "recProducts":  shuffle_products,
        "recProducts2": shuffle_products_2,
        "usercart":     usercart
    }) 

# Опции для фильтрации и тд
def get_attr_text_unique_values(attr_name,products): # Поиск уникальных текстовых значений у которых есть хотя бы один товар
    values = set()
    value_attribute = Attribute.objects.get(name=attr_name)
    # Получаем все уникальные значения атрибутта 
    unique_values = Value.objects.filter(attribute=value_attribute).values_list("value_text", flat=True).distinct()
    for value in unique_values:
        # Проходим по уникальным значения и проверяем есть ли у них товары
        if Value.objects.filter(attribute=value_attribute, value_text=value).exists() and products.filter(**{f'eav__{attr_name}': value}):
            values.add(value)
    return values

def get_category(products):
    objects_title_map = {
        "shoe":       "Обувь",
        "cloths":     "Одежда",
        "bags":       "Сумки",
        "clocks":     "Часы",
        "accessories":"Аксессуары",
        "cosmetics":  "Косметика",
        "technique":  "Техника",
        "toys":       "Игрушки",
        "sport":      "Спорт",
    }
    val_dict = {}
    for val in get_attr_text_unique_values('podcategory',products):
        podcategory = models.Podcategory.objects.get(name=val)
        cat_map = objects_title_map[podcategory.category]
        if cat_map not in val_dict.keys():
            val_dict[cat_map] = [podcategory,]
        else:
            val_dict[cat_map].append(podcategory) 
    return val_dict

def get_color_dict(products):
    val_dict = {}
    # Получаем все уникальные значения атрибутта
    for value in models.Color.objects.all():
        # Проходим по уникальным значения и проверяем есть ли у них товары
        if products.filter(color=value).exists():
            val_dict[value] = str(value.colorpicker) 
    return val_dict

def get_Brands(products):
    l_brands = {}
    for brand in get_attr_text_unique_values("brand",products):
        letter = (str(brand)[0]).upper()
        if letter in l_brands:
            l_brands[letter].append(brand)
        else: 
            l_brands[letter] = [brand]
    return dict(sorted(l_brands.items()))

def get_sizes(products):
    sizes = {}
    for product in products:
        for size in product.eav.sizes:
            siz, type_size = size.split("_")
            if type_size in sizes.keys():
                sizes[type_size].add(int(siz))
            else: 
                sizes[type_size] = set()
                sizes[type_size].add(int(siz))
    for key, size in sizes.items():
        sizes[key] = sorted(size)
    return sizes

def get_min_max_value_price(products): # мин и мах цена в категории 
    min_prices = []
    max_prices = []
    for product in products:
        try:
            min_att_value = product.eav.min_price
            max_att_value = product.eav.max_price
            min_prices.append(min_att_value)
            max_prices.append(max_att_value)
        except:
            pass

    min_price = min(min_prices) if min_prices else None
    max_price = max(max_prices) if max_prices else None
    return min_price, max_price

# Список товаров бренда
@csrf_exempt
def brand_results(request,brand_query):
    try:
        brand = models.Brand.objects.get(name=brand_query)
    except:
        return render(request, 'main/product_brand.html', {
            'brand':    brand_query,
            'notFound': False,
        })
    products = models.Product.objects.filter(eav__brand=brand_query).exclude(Q(prices__isnull=True) | Q(prices="") | Q(prices="{}") | Q(prices="None"))
    option_dict = get_option_list(products)

    notFound = False
    if option_dict['defcount'] > 0:
        notFound = True

    return render(request, 'main/product_brand.html', {
        'brand':    brand_query,
        'brandimg': str(brand.font),
        'notFound': notFound,

        "podcategors":  option_dict['podcategors'],
        "materials":    option_dict['materials'],
        "colors":       option_dict['colors'],
        "sizes":        option_dict['sizes'],
        "brands":       option_dict['brands'],
        "min_price":    option_dict['min_price'],
        "max_price":    option_dict['max_price'],
        "products":     option_dict['products'],
        "pages":        option_dict['pages'],
        "defcount":     option_dict['defcount']
    })

# Поиск по товарам
@csrf_exempt
def search_results(request,query):
    natquery = query
    products = models.Product.objects.filter(eav__brand_name__icontains=query)
    option_dict = get_option_list(products)
    if len(query) > 20 and not products:
        query = str(query)[:18] + "..."
    else:
        query = str(query)

    notFound = False
    if option_dict['defcount'] > 0:
        notFound = True
    return render(request, 'main/search_results.html', {
        'natquery': natquery,
        'query': query,
        'notFound': notFound,

        "podcategors":  option_dict['podcategors'],
        "materials":    option_dict['materials'],
        "colors":       option_dict['colors'],
        "sizes":        option_dict['sizes'],
        "brands":       option_dict['brands'],
        "min_price":    option_dict['min_price'],
        "max_price":    option_dict['max_price'],
        "products":     option_dict['products'],
        "pages":        option_dict['pages'],
        "defcount":     option_dict['defcount']
    })

option_map = {
    "color":       'color',
    "material":    'eav__material',
    "brand":       'eav__brand',
    "podcategory": 'eav__podcategory',
    "category":    'eav__podcategory',
    "sizes":       'eav__sizes__contains',
}
objects_title_map = {
    "shoe":       "Обувь",
    "cloths":     "Одежда",
    "bags":       "Сумки",
    "clocks":     "Часы",
    "accessories":"Аксессуары",
    "cosmetics":  "Косметика",
    "technique":  "Техника",
    "toys":       "Игрушки",
    "sport":      "Спорт",
}

# Страница товаров от категории
@csrf_exempt
def product_list(request, option_nav=None, option=None):
    path        = request.path.split("/")[2]
    title       = objects_title_map[path].title()
    products    = models.Product.objects.filter(category=path).exclude(Q(prices__isnull=True) | Q(prices="") | Q(prices="{}") | Q(prices="None"))
    option_dict = get_option_list(products, option, option_nav)

    return render(request, "main/all-product-list.html", {
        "title":        title,
        "path":         path,
        "option_nav":   option_nav,

        "podcategors":  option_dict['podcategors'],
        "materials":    option_dict['materials'],
        "colors":       option_dict['colors'],
        "sizes":        option_dict['sizes'],
        "brands":       option_dict['brands'],
        "min_price":    option_dict['min_price'],
        "max_price":    option_dict['max_price'],
        "products":     option_dict['products'],
        "pages":        option_dict['pages'],
        "defcount":     option_dict['defcount']
    })

# Словарь со всеми опциями фильтрации списка товаров
def get_option_list(products, option=None, option_nav=None):
    default_products = products

    if option and option_nav:
        products = products.filter(**{option_map[option]: option_nav}).exclude(Q(prices__isnull=True) | Q(prices="") | Q(prices="{}") | Q(prices="None"))
        count = products.count()
        print(products)
    else:
        count = default_products.count()

    paginator = Paginator(products.order_by('uid'), 4)
    results_products = [
        {
            'name':        product.name,
            'podcategory': product.podcategory,
            'brand':       str(product.brand.font),
            'img':         str(product.image1),
            'price':       ProcesPrice(product.min_price),
            'uid':         product.uid,
        }
        for product in paginator.page(1)
    ]

    value_min_price, value_max_price = get_min_max_value_price(products)
    return {
        "materials":    get_attr_text_unique_values('material',default_products),
        "podcategors":  get_category(default_products),
        "colors":       get_color_dict(default_products),
        "sizes":        get_sizes(default_products),
        "brands":       get_Brands(default_products),
        "min_price":    value_min_price,
        "max_price":    value_max_price,
        "products":     results_products,
        "pages":        paginator.num_pages,
        "defcount":     count
    }


# Получение количество доступных опций с 
from django.db.models import Min,Max
@csrf_exempt
def number_of_options(request):

    filtered_products, min_price, max_price = filtering_products_by_option(request)
    counts = {}
    options = json.loads(request.POST.get('options'))
    for value_option, type_option in options.items():
        count = filtered_products.filter(**{option_map[type_option]: value_option}).count()
        counts[value_option] = "99+" if count > 99 else count
    
    return JsonResponse(
        {
            "counts": counts, 
            "count_show": filtered_products.count(),
            "min_price": min_price,
            "max_price": max_price,
        }
    )

from django.core.paginator import Paginator
@csrf_exempt
def get_filtered_products(request):
    products, min_price, max_price = filtering_products_by_option(request)
    sorting_option = request.POST.get('sorting_option', None)
    page           = request.POST.get('page', 1)
    count_products = products.count()

    if sorting_option: # data_create min_price -min_price
        paginator = Paginator(products.order_by(sorting_option), 4)
    else:
        paginator = Paginator(products.order_by("uid"), 4)
    
    countPages = paginator.num_pages
    response = [{
        'uid':         product.uid,
        'img':         str(product.image1),
        'name':        product.name,
        'podcategory': product.podcategory.name,
        'brand':       str(product.brand.font),
        'price':       ProcesPrice(product.min_price),
    } for product in paginator.page(page)]

    return JsonResponse({
        "products":       response,
        "new_pages":      countPages,
        "count_products": count_products
    })



from django.db.models import Q
def filtering_products_by_option(request):
    path      = request.POST.get('path', None)
    min_price = request.POST.get('min_price', None)
    max_price = request.POST.get('max_price', None)

    query_page = request.POST.get('query_page', None)
    brand_page = request.POST.get('brand_page', None)

    stock    = request.POST.getlist('Stock[]')
    sizes    = request.POST.getlist('Sizes[]')
    color    = request.POST.getlist('Color[]')
    material = request.POST.getlist('Material[]')
    brand    = request.POST.getlist('Brand[]')
    category = request.POST.getlist('Category[]')
    
    # print("min_price", min_price, "max_price", max_price, "stock", stock, "sizes", sizes, "color", color, "material", material, "brand", brand, "category", category)

    filter = Q()
    if query_page != "false" and query_page:
        filter.add(Q(name__icontains=query_page), Q.AND)
    if brand_page != "false" and brand_page:
        filter.add(Q(brand=brand_page), Q.AND)
    if color:
        filter.add(Q(color__name__in=color), Q.AND)
    if brand:
        filter.add(Q(eav__brand__in=brand), Q.AND)
    if material:
        filter.add(Q(eav__material__in=material), Q.AND)
    if category:
        filter.add(Q(eav__podcategory__in=category), Q.AND)
    if sizes:
        size_filter = Q()
        for size in sizes:
            size_filter |= Q(eav__sizes__contains=size)
        filter.add(size_filter, Q.AND)

    if path:
        semifil_products = models.Product.objects.filter(category=path).exclude(Q(prices__isnull=True) | Q(prices="") | Q(prices="{}") | Q(prices="None")).filter(filter)
    else:
        semifil_products = models.Product.objects.all().exclude(Q(prices__isnull=True) | Q(prices="") | Q(prices="{}") | Q(prices="None")).filter(filter)

    filtered_uid_list = []
    availble_prices = [] 
    if min_price != "NaN" and max_price != "NaN":
        for product in semifil_products:
            try:
                Json = json.loads(product.eav.available_size_price)
                if sizes:                                           # если есть размеры
                    for size in sizes:                              # Проходимся по ним
                        if product.eav.prices:                      # Если есть цены
                            for price in product.eav.prices:        # Проходимся по ценам продукта и добавляем
                                if stock:                           # И если товар должен быть в наличии
                                    availble_prices.append(int(Json[size]["price"]) if Json[size]["count"] > 0 else None)
                                else:                               # Если нет
                                    availble_prices.append(Json[size]["price"])
                                if int(price) >= int(min_price) and int(price) <= int(max_price): 
                                    # Если цена любого размера в диапозоне выбранной цена то добавляем его к отфильтрованным
                                    filtered_uid_list.append(product.uid)
                                    break
            
                else:                                               # Иначе
                    if product.eav.prices:                          # если есть цены
                        for price in product.eav.prices:            # Проходимся по ценам продукта и добавляем в availble_prices
                            if int(price) >= int(min_price) and int(price) <= int(max_price): # Так же если цена в диапозоне добавляет товар на вывод
                                if product.uid not in filtered_uid_list:
                                    filtered_uid_list.append(product.uid)
                            availble_prices.append(int(price))
            except:
                pass
        if availble_prices:
            new_max_price     = max(availble_prices)         # Находим максимальную цену
            new_min_price     = min(availble_prices)         # Находим минимальную цену
        else:
            new_max_price     = "No change"
            new_min_price     = "No change"
        filtered_products = models.Product.objects.filter(uid__in=filtered_uid_list) # Фильтруем по uid
    else:
        filtered_products = semifil_products
    return filtered_products, new_min_price, new_max_price



# Поиск по бредндам
@csrf_exempt
def search_brand_name(request): # Функция поиска по брендам
    letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
    query = request.POST.get('query')
    results = {}
    if query: # Если запрос есть
        product_query = models.Brand.objects.filter(name__icontains=query)
        for letter in letters:
            results[letter] = '' # Инициализация строки
            brands = product_query.filter(name__startswith=letter).distinct().order_by('name')
            
            results[letter] = [str(brand.name) for brand in brands]
        return JsonResponse({'results': results})
    else: # Очистка запрос
        results = query
        return JsonResponse({'results': results})
    
@csrf_exempt
def search_brand(request): # Функция поиска по брендам
    query       = request.POST.get('query', None)
    results     = []
    maximum     = 30
    if query: # Если запрос есть
        search_results = models.Brand.objects.filter(name__icontains=query)[:maximum]
        for result in search_results:
            results.append({
                'name': result.name,
                'img': str(result.font),
            })
        return JsonResponse({'results': results})
    else: # Очистка запрос
        results = query
        return JsonResponse({'results': results})

# Поиск по товарам
@csrf_exempt
def search_products(request): # Функция поиска по товарам
    query   = request.POST.get('query')
    results = []
    maximum = 8

    if query: # Если результат есть
        search_results = models.Product.objects.filter(eav__brand_name__icontains=query).distinct()[:maximum]
        for result in search_results:
            results.append({
                'name': result.eav.brand_name,
                'id': result.uid,
            })
        return JsonResponse({'results': results})