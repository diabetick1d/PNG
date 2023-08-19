from django import forms
from . import models
from django_json_widget.widgets import JSONEditorWidget

class ProductForm(forms.ModelForm):
    prices = forms.CharField(widget=JSONEditorWidget(height="500px"))
    class Meta:
        model = models.Product
        fields = '__all__'
