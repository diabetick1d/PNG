# Generated by Django 4.1.7 on 2023-08-03 09:21

import colorfield.fields
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0009_remove_homepageproduct_product4_and_more"),
    ]

    operations = [
        migrations.AddField(
            model_name="homepageproduct",
            name="colorpicker",
            field=colorfield.fields.ColorField(
                default="#000000",
                image_field=None,
                max_length=18,
                samples=None,
                verbose_name="Выбор цвета для текста",
            ),
        ),
        migrations.AddField(
            model_name="homepageproduct",
            name="text",
            field=models.CharField(
                default=1, max_length=255, verbose_name="Текст по средине"
            ),
            preserve_default=False,
        ),
    ]
