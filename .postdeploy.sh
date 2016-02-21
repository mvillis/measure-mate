#! /bin/sh

python manage.py migrate
python manage.py loaddata LAMA DevOps tags assessment
