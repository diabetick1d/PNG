from django.contrib import admin
from . import models, forms

admin.site.register(models.Podcategory)
admin.site.register(models.HomePageProduct)
admin.site.register(models.Brand)
admin.site.register(models.Color)
admin.site.register(models.Material)
class PodcategoryBrandforNav(admin.ModelAdmin):
    filter_vertical = ['podcategory','Brand']
admin.site.register(models.PodcategoryBrandforNav, PodcategoryBrandforNav)

class ProductAdmin(admin.ModelAdmin):
    list_display      = ("name","brand","material","category","podcategory")
    exclude           = ['min_price','max_price','Recomendation']
    search_fields     = ["name"]
    list_filter       = ["category","podcategory"]
    filter_horizontal = ["color"]
    form = forms.ProductForm
admin.site.register(models.Product, ProductAdmin)

def dublicate_element(modeladmin, request, queryset):
    #клонирование выбранных обьектов
    for element in queryset:
        element.pk = None
        element.save()

admin.site.add_action(dublicate_element,"Дублировать объект")

def just_save_element(modeladmin, request, queryset):
    #Пересохранение выбранных обьектов
    for element in queryset:
        element.save()

admin.site.add_action(just_save_element,"Пересохранить объект")