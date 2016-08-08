from measure_mate.settings.secure import *

INSTALLED_APPS += (
    'djsupervisor',
)

SUPERVISOR_CONFIG_FILE = 'supervisord.conf.tmpl'
