from measure_mate.settings.base import *

INSTALLED_APPS += (
    'gunicorn',

    # last application
    'djsupervisor'
)

