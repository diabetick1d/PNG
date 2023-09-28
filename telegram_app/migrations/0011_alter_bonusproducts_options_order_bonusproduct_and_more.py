# Generated by Django 4.1.7 on 2023-09-20 12:16

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("telegram_app", "0010_remove_user_list_buy_remove_user_list_returns_and_more"),
    ]

    operations = [
        migrations.AlterModelOptions(
            name="bonusproducts",
            options={
                "verbose_name": "Товары на бонусную систему",
                "verbose_name_plural": "Товары на бонусную систему",
            },
        ),
        migrations.AddField(
            model_name="order",
            name="bonusproduct",
            field=models.BooleanField(
                default=False, editable=False, verbose_name="Бонусный товар"
            ),
        ),
        migrations.AlterField(
            model_name="order",
            name="client",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
                verbose_name="username in the telegram",
            ),
        ),
        migrations.AlterField(
            model_name="order",
            name="promocode",
            field=models.ForeignKey(
                blank=True,
                null=True,
                on_delete=django.db.models.deletion.SET_NULL,
                to="telegram_app.promocode",
                verbose_name="Промокод при оформлении заказа",
            ),
        ),
        migrations.AlterField(
            model_name="returns",
            name="client",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
                verbose_name="username in the telegram",
            ),
        ),
        migrations.AlterField(
            model_name="returns",
            name="number_order",
            field=models.ForeignKey(
                on_delete=django.db.models.deletion.CASCADE,
                to="telegram_app.order",
                verbose_name="Номер заказа от которого идет возврат",
            ),
        ),
    ]
