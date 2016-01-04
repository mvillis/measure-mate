Dev Central
-----

[![Build Status](https://travis-ci.org/mvillis/measure-mate.svg)](https://travis-ci.org/mvillis/measure-mate)
[![Coverage Status](https://coveralls.io/repos/mvillis/measure-mate/badge.svg?branch=master&service=github)](https://coveralls.io/github/mvillis/measure-mate?branch=master)

Demo
-----

[Live Site (hosted on Heroku)](https://measuremate.herokuapp.com)

Setup
-----

These instructions assume that you already have *npm* installed on your workstation.
The best way to do this is to just install  [NodeJS](https://nodejs.org/en/).

```
npm install -g bower
virtualenv .venv
```

Sometimes admin privilege (ie. sudo) is required to install bower.

Linux|Windows
---|---
```source .venv/bin/activate```|```.venv\Scripts\activate```
```
pip install -r requirements/local.txt
```

In order to install mock you may need to update your versions of pip, wheel and setuptools. After creating your virtual environment the following command will do the trick:

```
$ pip install -U pip wheel setuptools
```

Testing
-------

Linux|Windows
---|---
<ul><li>```export DJANGO_SETTINGS_MODULE=measure_mate.settings```</li><li>```export DATABASE_URL=sqlite:///`pwd`/measure_mate.sqlite```</li></ul> |<ul><li>```set DJANGO_SETTINGS_MODULE=measure_mate.settings```</li><li>```set DATABASE_URL=sqlite:///C:\\your_sqlite_path\\measure-matemeasure_mate.sqlite```</li></ul>

```
python manage.py test
```

Coverage
-------

This assumes that the env settings from above are still in place.

Linux|Windows
---|---
<ul><li>```export DJANGO_SETTINGS_MODULE=measure_mate.settings```</li><li>```export DATABASE_URL=sqlite:///`pwd`/measure_mate.sqlite```</li></ul> |<ul><li>```set DJANGO_SETTINGS_MODULE=measure_mate.settings```</li><li>```set DATABASE_URL=sqlite:///C:\\your_sqlite_path\\measure-matemeasure_mate.sqlite```</li></ul>

```
coverage run manage.py test
coverage report -m
```

Running (locally)
-------

Linux|Windows
---|---
<ul><li>```export DJANGO_SETTINGS_MODULE=measure_mate.settings```</li><li>```export DATABASE_URL=sqlite:///`pwd`/measure_mate.sqlite```</li></ul> |<ul><li>```set DJANGO_SETTINGS_MODULE=measure_mate.settings```</li><li>```set DATABASE_URL=sqlite:///C:\\your_sqlite_path\\measure-matemeasure_mate.sqlite```</li></ul>
```
python manage.py migrate
bower install
python manage.py collectstatic
python manage.py runserver
```

Running (heroku)
------

Some custom build packs are needed in heroku to manage the collection of bower dependencies.

```
$ heroku login
...
$ heroku buildpacks:set https://github.com/ddollar/heroku-buildpack-multi.git --app measuremate
```

This will pick up the config found in ```.buildpacks```.


Contributing
-------

Please read
[CONTRIBUTING.md](https://github.com/mvillis/measure-mate/blob/master/CONTRIBUTING.md) if you wish to contribute.
