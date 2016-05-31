import os

from measure_mate.settings.base import *

SECURE_SSL_REDIRECT = True
SECURE_REDIRECT_EXEMPT = (
    r'^healthcheck\/?$',
)

SECURE_HSTS_SECONDS = 31536000
SECURE_HSTS_INCLUDE_SUBDOMAINS = True

SESSION_COOKIE_SECURE = True

CSRF_COOKIE_SECURE = True
CSRF_COOKIE_HTTPONLY = True

DEBUG = os.environ.get('DJANGO_DEBUG', False)

SECRET_KEY = os.environ['DJANGO_SECRET_KEY']
