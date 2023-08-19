from django import template
register = template.Library()

@register.filter
def to_string(value):
    return str(value)

@register.filter
def takefirst(value):
    return value[0]

@register.filter
def takesecond(value):
    return value[1]