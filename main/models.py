from django.db import models
import json
try:
    from django.db.models import JSONField
except ImportError:
    from django.contrib.postgres.fields import JSONField
from django.core.validators import MinValueValidator, MaxValueValidator
from django.core.exceptions import ValidationError
from django.dispatch import receiver

CATEGORIES_CHOICES = (
    ("shoe",         "Обувь"),
    ("cloths",       "Одежда"),
    ("bags",         "Сумки"),
    ("clocks",       "Часы"),
    ("accessories",  "Аксессуары"),
    ("cosmetics",    "Косметика"),
    ("technique",    "Техника"),
    ("toys",         "Игрушки"),
    ("sport",        "Спорт"),
) # ["shoe","cloths","bags","clocks","accessories","cosmetics","technique","toys","sport"]
CATEGORIES_DICT = {key: value for key, value in CATEGORIES_CHOICES}

class RangeIntegerField(models.IntegerField):
    def __init__(self, *args, **kwargs):
        validators = kwargs.pop("validators", [])
        
        # turn min_value and max_value params into validators
        min_value = kwargs.pop("min_value", None)
        if min_value is not None:
            validators.append(MinValueValidator(min_value))
        max_value = kwargs.pop("max_value", None)
        if max_value is not None:
            validators.append(MaxValueValidator(max_value))

        kwargs["validators"] = validators

        super().__init__(*args, **kwargs)

class Brand(models.Model):
    name    = models.CharField("Название брэнда",max_length=50, db_index=True,primary_key=True)
    font    = models.ImageField("Фото брэнда", upload_to='font_brand/')
    rarity  = models.IntegerField("Рарность", default=1, validators=[MaxValueValidator(10), MinValueValidator(1)])

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name        = "Бренд"
        verbose_name_plural = "Бренды"

from colorfield.fields import ColorField
class Color(models.Model):
    name = models.CharField("Цвет",max_length=20, db_index=True,primary_key=True)
    colorpicker = ColorField(verbose_name="Выбор цвета для отображения",default='#FF0000')

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name        = "Цвет"
        verbose_name_plural = "Цвета"

class Podcategory(models.Model):
    name = models.CharField("Подкатегория",max_length=20,primary_key=True)
    category = models.CharField(max_length=20, choices=CATEGORIES_CHOICES,verbose_name="Категория")

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    
    class Meta:
        verbose_name        = "Подкатегория"
        verbose_name_plural = "Подкатегории"

class Material(models.Model):
    name = models.CharField("Материал",max_length=20,primary_key=True)

    def save(self, *args, **kwargs):
        self.name = self.name.title()
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
    class Meta:
        verbose_name        = "Материал"
        verbose_name_plural = "Материалы"

import eav
from main.views import ProcesPrice
class Product(models.Model): # Базовая модель для всех товаров
    uid         = models.AutoField(primary_key=True)
    url         = models.CharField(max_length=255, verbose_name="Ссылка на товар(poizon)")
    name        = models.CharField("Название (нельзя '#')",max_length=255)
    brand       = models.ForeignKey(Brand, on_delete=models.PROTECT,verbose_name="Бренд")
    color       = models.ManyToManyField(Color,verbose_name="Цвет")
    material    = models.ForeignKey(Material, on_delete=models.PROTECT,verbose_name="Материал")
    category    = models.CharField(max_length=20, choices=CATEGORIES_CHOICES,verbose_name="Категория")
    podcategory = models.ForeignKey(Podcategory, on_delete=models.PROTECT,verbose_name="Подкатегория")
    popularity  = models.IntegerField("Популярность", default=0)

    composition = models.TextField("Состав", blank=True, null=True)
    content     = models.TextField("Содержание", blank=True, null=True)
    sizechart   = models.ImageField("Размерная сетка", upload_to='size_chart/')

    image1 = models.ImageField(upload_to="product_images/", verbose_name="Картинка #1")
    image2 = models.ImageField(upload_to="product_images/", blank=True, null=True,verbose_name="Картинка #2")
    image3 = models.ImageField(upload_to="product_images/", blank=True, null=True,verbose_name="Картинка #3")
    image4 = models.ImageField(upload_to="product_images/", blank=True, null=True,verbose_name="Картинка #4")
    image5 = models.ImageField(upload_to="product_images/", blank=True, null=True,verbose_name="Картинка #5")
    image6 = models.ImageField(upload_to="product_images/", blank=True, null=True,verbose_name="Картинка #6")


    Recomendation = models.JSONField(verbose_name="Рекомендации", blank=True)
    # {"size": {"prices": "123", "count": "1"}}
    prices        = JSONField(verbose_name="Цены", default=dict)
    # output - #"{\"35\":{\"price\":1500,\"count\":4},\"36\":{\"price\":16400,\"count\":6},\"37\":{\"price\":6000,\"count\":6},\"38\":{\"price\":21240,\"count\":3}}" # count - есть или нету (1 или 0)
    min_price = models.IntegerField("Минимальная цена",default=0)
    max_price = models.IntegerField("Максимальная цена",default=0)

    data_create = models.DateTimeField(verbose_name="Дата добавления товара (автоматически)",auto_now_add=True)
    type_size   = models.CharField(max_length=20, blank=True, verbose_name="Тип размера товара(Необязательно)")

    def save(self, *args, **kwargs):
        self.eav.brand       = str(self.brand)
        self.eav.material    = str(self.material)
        self.eav.category    = str(self.category)
        self.eav.min_price   = int(self.min_price)
        self.eav.max_price   = int(self.max_price)
        self.eav.podcategory = str(self.podcategory)
        self.eav.brand_name = str(self.brand.name) + " " + str(self.name)

        # Список рекомендованных (20шт.) берем только 5 штук на вывод в представлении
        category = self.eav.category

        catProduct = Product.objects.filter(category=category)
        recProduct = []

        testmaterial = catProduct.filter(material=self.material).order_by("popularity")[:10]
        testmaterial = testmaterial | catProduct.filter(material=self.material)[:10]
        if testmaterial.count() > 1:        # Берем 10 похожих по материалу
            recProduct.extend(testmaterial)

        testbrand = catProduct.filter(brand=self.brand).order_by("popularity")[:10]
        testbrand = testbrand | catProduct.filter(brand=self.brand)[:10]
        if testbrand.count() > 1:           # Берем 10 похожих по бренду
            recProduct.extend(testbrand)

        testpodcategory = catProduct.filter(podcategory=self.podcategory).order_by("popularity")[:10]
        testpodcategory = testpodcategory | catProduct.filter(podcategory=self.podcategory)[:10]
        if testpodcategory.count() > 1:     # Берем 10 похожих по подкатегории
            recProduct.extend(testpodcategory)

        # Сохранение рекомендаций
        RecProduct = {
            product.name: {
                'name':  product.name,
                'brand': str(product.brand.font),
                'img':   str(product.image1),
                'price': ProcesPrice(product.min_price),
                'uid':   product.uid,
            } for product in recProduct
        }
        self.Recomendation = json.dumps(RecProduct)

        # eav +-
        try:
            jSon = json.loads(self.prices)
            if self.type_size:
                typd = self.type_size
            else:
                typd = dict(CATEGORIES_CHOICES)[self.category]

            if type(jSon) == dict:
                prices     = []
                eav_prices = {}
                for key, value in jSon.items():
                    if int(value["count"]) > 0:
                        prices.append(int(value["price"]) if int(value["price"]) > 0 else 0)
                    eav_prices[f"{key}_{typd}"] = value
                self.min_price = min(prices)
                self.max_price = max(prices)

            self.eav.available_size_price = json.dumps(eav_prices)
            sizes = ";".join([f"{size}_{typd}" for size in jSon.keys()])
            self.eav.sizes  = sizes      # Для фильтрации по размерам
            priceslist = ";".join([f"{price}" for price in prices])
            self.eav.prices = priceslist # для фильтрации по цене
        except:
            pass

        if "#" in self.name:
            raise ValidationError("Символ '#' запрещен в названии товара!")

        super(Product, self).save(*args, **kwargs)

    def __str__(self):
        return self.name
    class Meta:
        verbose_name        = "Товар"
        verbose_name_plural = "Товары"
eav.register(Product)

class HomePageProduct(models.Model):
    title = models.ImageField(upload_to="main/", verbose_name="Фото, что будет сверху (при нажатии будет переводить на бренд)")
    brand = models.ForeignKey(Brand, on_delete=models.PROTECT)
    text  = models.CharField(max_length=255, verbose_name="Текст по средине")
    color = ColorField(verbose_name="Выбор цвета для текста",default='#000000')
    product1 = models.ForeignKey(Product,related_name="product2", on_delete=models.CASCADE, null=True, blank=True,verbose_name="Товар #1")
    product2 = models.ForeignKey(Product,related_name="product3", on_delete=models.CASCADE, null=True, blank=True,verbose_name="Товар #2")
    product3 = models.ForeignKey(Product,related_name="product4", on_delete=models.CASCADE, null=True, blank=True,verbose_name="Товар #3")

    def __str__(self):
        return str(self.brand) + " | " + self.product1.name + " | " + self.product2.name + " | " + self.product3.name
    class Meta:
        verbose_name        = "Товары на главной странице"
        verbose_name_plural = "Товары на главной странице"

from main.management.commands import UpHeaderNav
class PodcategoryBrandforNav(models.Model):
    category    = models.CharField(max_length=20, choices=CATEGORIES_CHOICES,verbose_name="Категория")
    podcategory = models.ManyToManyField(Podcategory, verbose_name="Подкатегории в меню",blank=True)
    Brand       = models.ManyToManyField(Brand, verbose_name="Бренды в меню",blank=True)

    def save(self, *args, **kwargs):
        UpHeaderNav.update_nav_menu()
        super().save(*args, **kwargs)

    def __str__(self):
        return CATEGORIES_DICT[self.category]
    
    class Meta:
        verbose_name        = "Подкатегории и Бренды для меню"
        verbose_name_plural = "Подкатегории и Бренды для меню"
