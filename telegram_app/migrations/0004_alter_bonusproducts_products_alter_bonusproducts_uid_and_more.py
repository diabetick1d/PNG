# Generated by Django 4.1.7 on 2023-08-08 16:31

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0012_alter_homepageproduct_title_alter_product_image1"),
        ("telegram_app", "0003_bonusproducts"),
    ]

    operations = [
        migrations.AlterField(
            model_name="bonusproducts",
            name="products",
            field=models.ManyToManyField(
                to="main.product", verbose_name="Товары на бонус систем"
            ),
        ),
        migrations.AlterField(
            model_name="bonusproducts",
            name="uid",
            field=models.AutoField(
                editable=False, primary_key=True, serialize=False, verbose_name="УАДИ"
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="bonus",
            field=models.ForeignKey(
                blank=True,
                on_delete=django.db.models.deletion.CASCADE,
                to=settings.AUTH_USER_MODEL,
                verbose_name="От кого зарегался",
            ),
        ),
        migrations.AlterField(
            model_name="user",
            name="bonus_number",
            field=models.IntegerField(
                blank=True, null=True, verbose_name="Кол-во бонус-покупок"
            ),
        ),
    ]
