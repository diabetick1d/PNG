from django import forms
from django.forms.widgets import Widget
from . import models
import json
from django.utils.safestring import mark_safe

class CartOrderWidget(Widget):
    def render(self, name, value, attrs=None, renderer=None):
        if value is not None:
            val = json.loads(json.loads(value))
            items = []
            for item in val: # нужно сделать норм json в html и
                item_str = f"""
                <div class="product-lcheck" data-url="{item['url']}" data-uid="{item['uid']}" data-price='{item['price']}' data-size="{item['size']}">
                <span></span>
                Url: {item['url']}, uid-PNG: {item['uid']}, Name: {item['name']}, Size: {item['size']}, Price: {item['price']}
                </div>"""
                items.append(item_str)
            button = "<button style='width: 150px;'>На возврат</button>"
            style  = """<style>
            .product-lcheck {width:100% !important;display:flex !important;align-items:center;border:solid #417690;border-width: 2px 0px;margin:5px 0px; gap: 15px;}
            span {display:block; width: 15px;height: 15px; background-color: #417690; margin: 5px ;}
            .product-lcheck.active span {display:block;background-color: #FFF;}
            </style>"""
            js     = """<script>
                var labels = document.querySelectorAll('.product-lcheck');
                labels.forEach(label => {
                    label.onclick = function(event) {
                        label.classList.toggle('active');
                    }
                });

                var button = document.querySelector('#items-return button');
                button.onclick = function(event) {
                    event.preventDefault();
                    var uid_order = document.querySelector("div.form-row.field-uid > div > div").innerText;
                    var uid_list = {};
                    labels.forEach(label => {
                        if (label.classList.contains('active')) {
                            uid_list[label.getAttribute('data-uid')] = {"price": label.getAttribute('data-price'), "size": label.getAttribute('data-size'), "url": label.getAttribute('data-url')};
                        }
                    });

                    fetch("/return/get", 
                        {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json"
                        },
                        body: JSON.stringify({
                            'uid_list': JSON.stringify(uid_list),
                            'uid_order': uid_order
                        })
                    })
                    .then(function(response) {
                        if (!response.ok) {
                            throw new Error("Ошибка HTTP: " + response.status);
                        }
                        return response.json();
                    })
                    .then(function(data) {
                        if (data.success) {
                            alert("Возврат успешно оформлен");
                        } else {
                            alert("Произошла ошибка: " + data.error);
                        }
                    });
                }
            </script>"""
            items_output = "\n".join(items)
            return mark_safe(f"<div id='items-return' style='display: grid;'>{items_output}{button}</div>{style}{js}")

    def value_from_datadict(self, data, files, name):
        return data.get(name, None)
    
class CartOrderWidgetSimple(Widget):
    def render(self, name, value, attrs=None, renderer=None):
        if value is not None:
            val = json.loads(json.loads(value))
            items = []
            for item in val: # нужно сделать норм json в html и
                item_str = f"""
                <div class="product-lcheck">
                Url: {item['url']}, uid-PNG: {item['uid']}, Name: {item['name']}, Size: {item['size']}, Price: {item['price']}
                </div>"""
                items.append(item_str)
            style  = """<style>
            .product-lcheck {width:100% !important;display:flex !important;align-items:center;border:solid #417690;border-width: 2px 0px;margin:5px 0px; gap: 15px;}
            </style>"""
            items_output = "\n".join(items)
            return mark_safe(f"<div id='items-return' style='display: grid;'>{items_output}</div>{style}")

    def value_from_datadict(self, data, files, name):
        return data.get(name, None)
    
class UserPersonalForm(forms.ModelForm):    
    error_css_class = "error"
    class Meta:
        model = models.User
        fields = ('first_name','last_name','surname','base_type_deliver','base_adress','base_delivery_point','base_number_phone','up_to_politic')

class ReturnsForm(forms.ModelForm):    
    error_css_class = "error"
    class Meta:
        model = models.Returns
        fields = ('card_number','bank','name')


