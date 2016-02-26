# -*- coding: utf-8 -*-

# https://djangosnippets.org/snippets/2895/


from functools import wraps

from django.utils.decorators import available_attrs


def header(name, value):
    # View decorator that sets a response header.
    # 
    # Example:
    # @header('X-Powered-By', 'Django')
    # def view(request, ...):
    #     ....
    #
    # For class-based views use:
    # @method_decorator(header('X-Powered-By', 'Django'))
    # def get(self, request, ...)
    #     ...
    def decorator(func):
        @wraps(func, assigned=available_attrs(func))
        def inner(request, *args, **kwargs):
            response = func(request, *args, **kwargs)
            response[name] = value
            return response
        return inner
    return decorator


allow_origin = lambda origin: header('Access-Control-Allow-Origin', origin)
allow_origin_all = allow_origin('*')

x_ua_compatible = lambda ie: header('X-UA-Compatible', ie)
