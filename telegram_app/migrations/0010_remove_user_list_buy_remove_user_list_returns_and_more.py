# Generated by Django 4.1.7 on 2023-09-05 14:42

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("telegram_app", "0009_alter_order_client_alter_promocode_promocode_and_more"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="user",
            name="list_buy",
        ),
        migrations.RemoveField(
            model_name="user",
            name="list_returns",
        ),
        migrations.AlterField(
            model_name="order",
            name="client",
            field=models.ForeignKey(
                on_delete=models.SET("**УДАЛЕН**"),
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
                on_delete=models.SET("**УДАЛЕН**"),
                to="telegram_app.promocode",
                verbose_name="Промокод при оформлении заказа",
            ),
        ),
        migrations.AlterField(
            model_name="returns",
            name="client",
            field=models.ForeignKey(
                on_delete=models.SET("**УДАЛЕН**"),
                to=settings.AUTH_USER_MODEL,
                verbose_name="username in the telegram",
            ),
        ),
        migrations.AlterField(
            model_name="returns",
            name="number_order",
            field=models.ForeignKey(
                on_delete=models.SET("**УДАЛЕН**"),
                to="telegram_app.order",
                verbose_name="Номер заказа от которого идет возврат",
            ),
        ),
    ]
