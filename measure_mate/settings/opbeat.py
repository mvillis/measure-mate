import os

from measure_mate.settings.secure import *

INSTALLED_APPS += (
    'opbeat.contrib.django',
)

OPBEAT = {
    'ORGANIZATION_ID': 'd7dba82e5f3c4f57b6ccda5c1f876bc6',
    'APP_ID':          os.environ['OPBEAT_APP_ID'],
    'SECRET_TOKEN':    os.environ['OPBEAT_SECRET_TOKEN'],
}

MIDDLEWARE_CLASSES.insert(0, 'opbeat.contrib.django.middleware.OpbeatAPMMiddleware')
CSP_CONNECT_SRC += ("intake.opbeat.com",)
