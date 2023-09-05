from django.db import models
from django.core.exceptions import ValidationError
from django.conf import settings
from main import models as MAINmodels
import telebot


class Promocode(models.Model):
    promocode   = models.CharField(verbose_name="Промокод (Промокоды лучше не удалять только в крайней мере, тк у заказов где был промокод вместо него будет null)",blank=False,max_length=40)
    count       = models.IntegerField(verbose_name="Кол-во использований", default=99999)
    price       = models.IntegerField(verbose_name="Скидка")
    description = models.TextField(verbose_name="Описание", blank=True, null=True)

    class Meta:
        verbose_name = "Промокод"
        verbose_name_plural = "Промокоды"

    def __str__(self):
        return self.promocode

# Create your models here.
class support_query_model(models.Model):
    userid      = models.IntegerField(blank=True,null=True, verbose_name="id пользователя в телеграмм")
    chatid      = models.IntegerField(blank=True,null=True, verbose_name="id чата")
    text        = models.TextField(blank=True, verbose_name="Обращение")
    text_requet = models.TextField(blank=True, verbose_name="Ответ")
    checked     = models.BooleanField(default=False, verbose_name="Проверенно?")

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        

    def save(self, *args, **kwargs):
        if self.pk is None:
            super().save(*args, **kwargs)
            return
        else:
            if self.checked:
                super().save(*args, **kwargs)

                bot = telebot.TeleBot(token=settings.TELEGRAM_BOT_TOKEN)
                bot.send_message(chat_id=self.chatid, text=f"""Вам пришел ответ:\n```{self.text_requet}```\nНа ваш запрос:\n```{self.text}```""",parse_mode='MarkdownV2')
            else:
                raise ValidationError("Поставь галочку Проверенно перед тем как отправить ответ.")
    
    class Meta:
        verbose_name = "Обращение"
        verbose_name_plural = "Обращения"

from django.contrib.auth.models import AbstractUser, Group, Permission
import random
import json
class User(AbstractUser):
    uid               = models.IntegerField(blank=True,primary_key=True,unique=True, verbose_name="id в телеграмме")
    first_name        = models.CharField(max_length=41,verbose_name="Имя")
    last_name         = models.CharField(max_length=41,verbose_name="Фамилия")
    surname           = models.CharField(max_length=41,verbose_name="Отчество")
    username          = models.CharField(unique=True, max_length=41,verbose_name="@username в tg")

    # False - SDEK, True - RUSSIA
    base_type_deliver = models.BooleanField(verbose_name="Способ доставки заказа",default="False")
    base_adress       = models.TextField(blank=True,verbose_name="Стандартный адрес доставки")
    base_delivery_point  = models.TextField(blank=True,verbose_name="Стандартный адрес СДЭКа")
    base_number_phone = models.CharField(blank=True,max_length=21,verbose_name="Номер телефона")

    up_to_politic     = models.BooleanField(verbose_name="Пользовательское соглашение",default="False")
    bonus_reference   = models.CharField(max_length=50,unique=True, blank=True,verbose_name="Ссылка для бонус систем")
    bonus             = models.ForeignKey(to="self",on_delete=models.CASCADE, null=True, blank=True,verbose_name="От кого зарегался")
    bonus_number      = models.IntegerField(default=0, verbose_name="Кол-во бонус-покупок")

    # {key: value}
    # {"{uid}-{size}": "{price}"}
    used_promo        = models.JSONField(verbose_name="Ипользованные промокоды", default=list)
    favorite          = models.JSONField(verbose_name="Избранное пользователя",default=list)
    cart              = models.JSONField(verbose_name="Корзина пользователя",default=dict)
    
    def save(self, *args, **kwargs):
        letters = ['a', 'c', 'e', 'P', 'N', 'G', 'g', 'I', 'k', 'm', 'o', 'q', 's', 'v', 'x', 'y', 'z', 'P', 'N', 'G', '1', '2', '3','2', '3', '4', '5'] 
        bonus_str = ''.join(random.choice(letters) for i in range(23))
        try: # Если такая ссылка уже есть то создаём новую
            self.bonus_reference = bonus_str
        except:
            bonus_str = ''.join(random.choice(letters) for i in range(20))
            self.bonus_reference = bonus_str

        super(User, self).save(*args, **kwargs)

    groups = models.ManyToManyField(
        Group,
        verbose_name=('Группы'),blank=True,
        help_text=('Группы, к которым принадлежит этот пользователь. Пользователь получит все разрешения, предоставленные каждой из его групп.'),
        related_query_name="user",
        related_name="%(app_label)s_%(class)s_groups",
    )
    user_permissions = models.ManyToManyField(
        Permission,
        verbose_name=('разрешения пользователя'),blank=True,
        help_text=('разрешения для этого пользователя.'),
        related_query_name="user",
        related_name="%(app_label)s_%(class)s_user_permissions",
    )

    class Meta:
        verbose_name = "Пользователь"
        verbose_name_plural = "Пользователя"

STATUS_CHOICES = (
    ("ordered","Заказано"),
    ("sent","Отправлено"),

    ("delivered_in_russian","Доставлено в Россию"),
    ("in_stock","На складе"),
    
    ("sent_from_stock","Отправлено со склада"),

    ("delivered_to_point","Доставлено в пункт"),
    ("received ","Получено"),
)

class Order(models.Model):
    uid           = models.AutoField(primary_key=True,editable=False,verbose_name="Номер заказа")
    number_order  = models.CharField(max_length=12, unique=True, editable=False,verbose_name="Номер заказа отформатированный")

    tracknumber   = models.CharField(max_length=120, blank=True, null=True,verbose_name="Номер отслеживания")
    status_order  = models.CharField(max_length=40,choices=STATUS_CHOICES,default="ordered",verbose_name="Статус заказа")
    type_delivery = models.CharField(max_length=40,verbose_name="Способ доставки заказа")
    promocode     = models.ForeignKey(Promocode,on_delete=models.SET_NULL,verbose_name="Промокод при оформлении заказа",blank=True,null=True)

    
    first_name    = models.CharField(max_length=40,verbose_name="Имя получателя")
    last_name     = models.CharField(max_length=40,verbose_name="Фамилия получателя")
    surname       = models.CharField(max_length=40,verbose_name="Отчество получателя")
    number_phone  = models.CharField(verbose_name="Номер телефона получателя",max_length=20)
    adress        = models.CharField(max_length=120,verbose_name="Адрес доставки")
    delivery_point= models.CharField(max_length=90,verbose_name="Адрес пункта выдачи")
    
    cart_order    = models.JSONField(verbose_name="Товары в заказе")
    summ_price    = models.CharField(max_length=40,verbose_name="Сумма заказа")

    client        = models.ForeignKey(User,on_delete=models.CASCADE,verbose_name="username in the telegram")
    data_order    = models.DateField(auto_now_add=True, editable=False,verbose_name="Дата заказа")

    def save(self, *args, **kwargs):
        if not self.pk:  # Если это новый заказ
            while True: # Вычисляем префикс и суффикс для поля number_order
                number = random.randint(0, 999999)
                self.number_order = "{:03d}-{:03d}".format(number // 1000, number % 1000)
                if not Order.objects.filter(number_order=self.number_order).exists():
                    break
        super(Order, self).save(*args, **kwargs)

    class Meta:
        verbose_name = "Заказ"
        verbose_name_plural = "Заказы"

    def __str__(self):
        return self.number_order


RETURN_CHOICES = (
    ("return_1", "Возврат"),
    ("return_2", "Оформление возврата"),
    ("return_3", "Возврат оформлен"),
)

class Returns(models.Model):
    uid           = models.AutoField(primary_key=True,editable=False,verbose_name="Номер Возврата")
    number_order  = models.ForeignKey(Order,verbose_name="Номер заказа от которого идет возврат",on_delete=models.CASCADE)
    status_return = models.CharField(max_length=40,choices=RETURN_CHOICES,default="return_1",verbose_name="Статус заказа")
    
    promocode     = models.ForeignKey(Promocode,on_delete=models.SET_NULL,verbose_name="Промокод при оформлении заказа",blank=True,null=True)
    cart_return   = models.JSONField(verbose_name="Товары в возврате")
    summ_price    = models.CharField(max_length=40,verbose_name="Сумма возврата")

    card_number   = models.IntegerField(verbose_name="Номер карты",blank=True,null=True)
    bank          = models.CharField(max_length=40,verbose_name="Банк получателя",blank=True,null=True)
    name          = models.CharField(max_length=90,verbose_name="Получатель",blank=True,null=True)

    client        = models.ForeignKey(User,on_delete=models.CASCADE,verbose_name="username in the telegram")
    data_order    = models.DateField(auto_now_add=True, editable=False,verbose_name="Дата заказа")
    data_return   = models.DateField(auto_now_add=True, editable=False,verbose_name="Дата возврата")

    class Meta:
        verbose_name        = "Возврат"
        verbose_name_plural = "Возвраты"

    def __str__(self):
        return str(self.number_order.uid)

from main.management.commands import UpBonusSystem
class BonusProducts(models.Model):
    uid           = models.AutoField(primary_key=True,editable=False,verbose_name="УАДИ")
    bonus_count   = models.IntegerField(verbose_name="Количество бонусов на получение товара")

    products      = models.ManyToManyField(MAINmodels.Product,verbose_name="Товары на бонус систем")

    class Meta:
        verbose_name        = "Товары на бонус систем"
        verbose_name_plural = "Товары на бонус систем"

    def save(self, *args, **kwargs):
        super().save(*args, **kwargs)
        try:
            UpBonusSystem.update_bonus_products()
        except Exception as e:
            print("Ошибка обновления бонусов на товары", e)

    def __str__(self):
        return (f"{self.bonus_count} бонусов")