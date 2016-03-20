from measure_mate.settings.base import *

DEBUG = os.environ.get('DJANGO_DEBUG', True)

CSP_CONNECT_SRC = ("'self'", "ws://localhost:3000", "ws://127.0.0.1:3000")

INSTALLED_APPS += (
        'django_extensions',
)
