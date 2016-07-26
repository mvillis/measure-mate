from django.conf import settings
from django import template
import measure_mate

register = template.Library()

@register.simple_tag
def get_version():
    return measure_mate.__version__
