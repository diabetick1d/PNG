from django.core.management.base import BaseCommand
from random import sample
from main   import models
from jinja2 import Template
import os
from main import models

def update_nav_menu():    # Обновление html для меню
    nav_dict = {'shoe': {}, 'cloths': {}, 'bags': {}, 'clocks': {}, 'accessories': {}, 'cosmetics': {}, 'technique': {}, 'toys': {}, 'sport': {}}
    for model in models.PodcategoryBrandforNav.objects.all():
        p_list = model.podcategory.values_list("name", flat=True).distinct()
        b_list = model.Brand.values_list("name", flat=True).distinct()

        nav_dict[model.category]['category'] = p_list
        nav_dict[model.category]['brand']    = b_list
        
    template = Template(open('main/templates/main/Header-nav-default.html', 'r', encoding='utf-8').read())
    rendered_html = template.render(nav_dict=nav_dict)
    with open('main/templates/main/Header-nav.html', 'w', encoding='utf-8') as f:
        f.write(rendered_html)
    print("Header-nav.html updated")

def create_new_nav_menu(): # Создание нового меню или рандомайзер для него
    for model in models.PodcategoryBrandforNav.objects.all():
        products = models.Product.objects.filter(eav__category=model.category)
        if products:
            print(f"\n {model.category}")
            print(f"Old podcategory: {model.podcategory.all()} | Old Brand: {model.Brand.all()}")
            model.podcategory.clear()
            model.Brand.clear()

            p_list = products.values_list("podcategory", flat=True).distinct()
            b_list = products.values_list("brand", flat=True).distinct()
            shuffle_p_list = sample(list(p_list), min(len(p_list), 6))
            shuffle_b_list = sample(list(b_list), min(len(b_list), 6))


            queryset_p = models.Podcategory.objects.filter(name__in=shuffle_p_list)
            queryset_b = models.Brand.objects.filter(name__in=shuffle_b_list)
            model.podcategory.add(*queryset_p)
            model.Brand.add(*queryset_b)
            model.save()

            print(f"Updated podcategory: {model.podcategory.all()} | Updated Brand: {model.Brand.all()}")


class Command(BaseCommand):
    help = 'Update header navigation menu'

    def handle(self, *args, **kwargs):
        if models.PodcategoryBrandforNav.objects.count() == 0: # Если нету подкатегорий и брендов для меню
            for cat in ["shoe","cloths","bags","clocks","accessories","cosmetics","technique","toys","sport"]:
                nav = models.PodcategoryBrandforNav.objects.create(category=cat)
                nav.save()
        update_nav_menu()
        create_new_nav_menu()