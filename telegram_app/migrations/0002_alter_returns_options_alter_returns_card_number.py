# Generated by Django 4.1.7 on 2023-08-03 08:32

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("telegram_app", "0001_initial"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="returns",
            options={"verbose_name": "Возврат", "verbose_name_plural": "Возвраты"},
        ),
        migrations.AlterField(
            model_name="returns",
            name="card_number",
            field=models.IntegerField(
                blank=True, null=True, verbose_name="Номер карты"
            ),
        ),
    ]
