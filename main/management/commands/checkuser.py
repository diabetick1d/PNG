import os
import sys
from django.apps import apps
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'PNG.settings')
import django
from django.core.management.base import BaseCommand
django.setup()

class Command(BaseCommand):
  	# Используется как описание команды обычно
    help = 'Implemented to Django application telegram bot setup command'

    def handle(self, *args, **kwargs):      
        def check_model_relationships():
            telegram_app_user_model = apps.get_model('telegram_app', 'User')
            related_models = [f.related_model for f in telegram_app_user_model._meta.related_objects]
            print('Related models for telegram_app.User:', related_models)

        check_model_relationships()

        def list_models_and_foreignkeys():
            app = apps.get_app_config("main")
            for model in app.get_models():
                print(f'Model: {model.__name__}')
                foreign_keys = [field for field in model._meta.get_fields() if field.is_relation and field.many_to_one]
                for fk in foreign_keys:
                    print(f'  ForeignKey: {fk.name} -> {fk.related_model}')
                print()

        list_models_and_foreignkeys()