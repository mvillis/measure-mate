Dev Central
-----

[![Build Status](https://travis-ci.org/mvillis/measure-mate.svg)](https://travis-ci.org/mvillis/measure-mate)
[![Coverage Status](https://coveralls.io/repos/mvillis/measure-mate/badge.svg?branch=master&service=github)](https://coveralls.io/github/mvillis/measure-mate?branch=master)

Demo
-----

[Live Site (hosted on Heroku)](https://measuremate.herokuapp.com)

Setup
-----

```
virtualenv .venv
source .venv/bin/activate
pip install -r requirements/local.txt
```

In order to install mock you may need to update your versions of pip, wheel and setuptools. After creating your virtual environment the following command will do the trick:

```
$ pip install -U pip wheel setuptools
```

Testing
-------

```
export DJANGO_SETTINGS_MODULE=measure_mate.settings
export DATABASE_URL=sqlite:///`pwd`/measure_mate.sqlite
python src/manage.py test
```

Coverage
-------

```
coverage run src/manage.py test
coverage report -m
```

Running
-------

```
python src/manage.py migrate
python src/manage.py collectstatic
python src/manage.py runserver
```
