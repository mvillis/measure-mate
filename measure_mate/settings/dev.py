from measure_mate.settings.base import *

DEBUG = os.environ.get('DJANGO_DEBUG', True)

CSP_CONNECT_SRC += (
    "ws://localhost:*", "ws://127.0.0.1:*",
    "http://localhost:*", "http://127.0.0.1:*"
)

INSTALLED_APPS += (
    'django_extensions',
)
