# Generated by Django 4.1.7 on 2023-08-10 14:51

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("telegram_app", "0006_alter_user_bonus_number"),
    ]

    operations = [
        migrations.AddField(
            model_name="user",
            name="used_promo",
            field=models.JSONField(
                default=list, verbose_name="Ипользованные промокоды"
            ),
        ),
    ]
