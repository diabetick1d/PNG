from django.core.management.base import BaseCommand
from eav.models import Attribute

class Command(BaseCommand):
    help = 'Creates EAV attributes'

    def handle(self, *args, **kwargs):
        # Если получается взять 1 экземпляр то включительно фильтруем
        Attribute.objects.get_or_create(name='material',             datatype=Attribute.TYPE_TEXT) 
        Attribute.objects.get_or_create(name='category',             datatype=Attribute.TYPE_TEXT) 
        Attribute.objects.get_or_create(name='podcategory',          datatype=Attribute.TYPE_TEXT) 
        Attribute.objects.get_or_create(name='brand',                datatype=Attribute.TYPE_TEXT) 
        Attribute.objects.get_or_create(name='brand_name',           datatype=Attribute.TYPE_TEXT) 
        Attribute.objects.get_or_create(name='min_price',            datatype=Attribute.TYPE_INT) 
        Attribute.objects.get_or_create(name='max_price',            datatype=Attribute.TYPE_INT)
        Attribute.objects.get_or_create(name='sizes',                datatype=Attribute.TYPE_CSV)
        Attribute.objects.get_or_create(name='prices',               datatype=Attribute.TYPE_CSV)
        Attribute.objects.get_or_create(name='available_size_price', datatype=Attribute.TYPE_JSON) # Берем items для вывода уже отфильтрованных, выводим как значение, если получаем значение смотрим есть ли в диапозоне цены
        print("Create or get - attributes") 