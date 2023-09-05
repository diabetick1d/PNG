from django.contrib import admin
from . import models,forms
from django.db.models import JSONField

admin.site.register(models.Promocode)



# Register your models here.
class support_query(admin.ModelAdmin):
    list_display_links = ["userid"]
    list_display       = ["userid","checked"]
    exclude            = ['chatid']
    
    def has_add_permission(self, request, obj=None):
        return False
admin.site.register(models.support_query_model, support_query)

class UserAdmin(admin.ModelAdmin):
    list_display = ("uid", "username", "first_name", "last_name", "is_staff", "is_active")
    exclude      = ['up_to_politic','cart','favorite']

    def has_add_permission(self, request, obj=None):
        return False
admin.site.register(models.User, UserAdmin)

class OrderAdmin(admin.ModelAdmin):
    readonly_fields = ['client',"uid","number_order",'type_delivery','first_name','last_name','surname','number_phone','adress','delivery_point','promocode','summ_price',]
    formfield_overrides = {
        JSONField: {'widget': forms.CartOrderWidget},
    }
    search_fields = ["number_order"]
    list_display  = ['number_order', 'status_order', 'client', 'data_order',]
    list_filter   = ["status_order"]
    def has_add_permission(self, request, obj=None):
        return False
admin.site.register(models.Order, OrderAdmin)

class ReturnsAdmin(admin.ModelAdmin):
    readonly_fields = ["summ_price",'card_number','bank','name',"data_order","data_return","client", "number_order","promocode"]
    formfield_overrides = {
        JSONField: {'widget': forms.CartOrderWidgetSimple},
    }
    list_display  = ['number_order', 'status_return', 'client', 'data_order','data_return']
    def has_add_permission(self, request, obj=None):
        return False
admin.site.register(models.Returns, ReturnsAdmin)

class BonusAdmin(admin.ModelAdmin):
    filter_horizontal = ['products']
admin.site.register(models.BonusProducts, BonusAdmin)