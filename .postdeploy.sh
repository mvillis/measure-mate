#! /bin/sh

python manage.py migrate
python manage.py loaddata LAMA Governance DevOps tags

# won't work if there are already assessments
python manage.py loaddata assessment || true
