from django.core.management.base import BaseCommand
from random import sample
from main import models
from jinja2 import Template
import os
from telegram_app import models as telegram_models

def update_bonus_products():
    template = Template(open('main/templates/main/Bonus-system-default.html', 'r', encoding='utf-8').read())
    list_not_tuple = []
    count          = []
    for bonsys in telegram_models.BonusProducts.objects.all():
        list_not_tuple.append({
            "id":       bonsys.uid,
            "count":    bonsys.bonus_count,
            "products": [{
                "id":       product.uid,
                "name":     product.name,
                "brand":    product.brand.name,
                "img":      product.image1,
            }for product in bonsys.products.all()]
        }) # Преобразуем эту зрень в список
        count.append(bonsys.bonus_count)
    rendered_html = template.render(bonsys=list_not_tuple, count=(str(count).strip("[").strip("]")))
    with open('main/templates/main/Bonus-system.html', 'w', encoding='utf-8') as f:
        f.write(rendered_html) # Переписываем html под новый
    print("Bonus-system.html updated")

class Command(BaseCommand):
    help = 'Update bonus products on profile'

    def handle(self, *args, **kwargs):
        update_bonus_products()