# Generated by Django 4.1.7 on 2023-08-03 09:26

from django.db import migrations


class Migration(migrations.Migration):
    dependencies = [
        ("main", "0010_homepageproduct_colorpicker_homepageproduct_text"),
    ]

    operations = [
        migrations.RenameField(
            model_name="homepageproduct",
            old_name="colorpicker",
            new_name="color",
        ),
    ]