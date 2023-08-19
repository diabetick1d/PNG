# Generated by Django 4.1.7 on 2023-07-30 09:28

from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0005_homepageproduct_url"),
    ]

    operations = [
        migrations.RemoveField(
            model_name="homepageproduct",
            name="url",
        ),
        migrations.AddField(
            model_name="product",
            name="url",
            field=models.CharField(
                default=1, max_length=255, verbose_name="Ссылка на товар(poizon)"
            ),
            preserve_default=False,
        ),
    ]
