Measure Mate
============

Dev Central
-----------

[![Build Status](https://travis-ci.org/mvillis/measure-mate.svg)](https://travis-ci.org/mvillis/measure-mate)
[![Coverage Status](https://coveralls.io/repos/mvillis/measure-mate/badge.svg?branch=master&service=github)](https://coveralls.io/github/mvillis/measure-mate?branch=master)
[![Codecov](https://img.shields.io/codecov/c/github/mvillis/measure-mate/master.svg?maxAge=2592000)](http://codecov.io/github/mvillis/measure-mate?branch=master)
[![Stories in Progress](https://badge.waffle.io/mvillis/measure-mate.svg?label=in%20progress&title=In%20Progress)](http://waffle.io/mvillis/measure-mate)
[![js-standard-style](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)
[![Code Climate](https://codeclimate.com/github/mvillis/measure-mate/badges/gpa.svg)](https://codeclimate.com/github/mvillis/measure-mate)

Demo
----

[Live Site (hosted on Heroku)](https://measuremate.herokuapp.com/)

Setup (common to both local and prod deployments)
-------------------------------------------------

These instructions assume that you already have *npm* installed on your
workstation. The best way to do this is to just install
[NodeJS](https://nodejs.org/).

These instructions also assume you have a working python 2.7.x environment
running, with *virtualenv*, *setuptools* and *pip* installed.

Run the follow commands to set up your npm dependencies and your python virtual
env:

```bash
npm install -g gulp
npm install
```

After the `npm install` command, you need to use gulp to build the javascript client.

```bash
gulp build --production
```

`gulp build --production` and in particular the `--production` flag has the
effect of

* bundling
* minifying
* gzipping

much of the css/javascript ready for the real world. If you're looking to
commence development, this will be quickly overridden by raw sources in later
steps.

Now go on and activate your python virtual environment and install the project's
python dependencies using pip:

```bash
virtualenv .venv
source .venv/bin/activate
pip install -r requirements/local.txt
```

In order to install mock you may need to update your versions of pip, wheel and
setuptools. After creating your virtual environment the following command will
do the trick:

```bash
pip install -U pip wheel setuptools
```

And you're all done setting up the basics. Follow through one of the sections
below to complete your environments:

* Test
* Check coverage
* Run locally
* Run on heroku
* Run on a production server

Testing
-------

```bash
# python
export DJANGO_SETTINGS_MODULE=measure_mate.settings.dev
python manage.py collectstatic
python manage.py test

# javascript
gulp test

```

Coverage
--------

This assumes that the env settings from the Testing section are still in place.

```bash
# python
coverage run manage.py test
coverage report -m

# javascript
gulp test #look for report in ./coverage/lcov-report/index.html
```

Running (locally)
-----------------

Firstly set up some environment variables:

```bash
export DJANGO_SETTINGS_MODULE=measure_mate.settings.dev
```

To develop you need to have both the python django development server running as
well as gulp. Gulp will detect css/js changes and auto refresh the browser as
you make changes.

Process One (aka. terminal window one)

```bash
python manage.py migrate
python manage.py runserver
```

Process Two (aka. terminal window two)

```bash
gulp
```

If the gulp build passes, a browser window will automatically open directing you
to the site.

<http://locahost:3000>

Gulp and Django as integrated via static files (ie. the output of the gulp
process is a folder which is configured to be included in Django's static
content).

If you're running OSX a sound / notification will show should the gulp watcher
detect any issues in the build (eg. lint issues).

You are now free to use, change and tinker locally on Measure Mate.

Running (special heroku setup)
------------------------------

Some custom build packs are needed in heroku to manage the collection of bower
dependencies.

```bash
$ heroku login
...
$ heroku buildpacks:clear --app measuremate
...
$ heroku buildpacks:set heroku/nodejs --app measuremate
...
$ heroku buildpacks:add heroku/python --app measuremate
Buildpack added. Next release on measuremate will use:

  1. heroku/nodejs
  2. heroku/python

Run git push heroku master to create a new release using these buildpacks.
```

Running (production)
--------------------

Given that you've completed the steps in the *setup* section, you must firstly
set up some environment variables:

```bash
export DJANGO_SETTINGS_MODULE=measure_mate.settings.secure
export DJANGO_SECRET_KEY=r@nd0m_$eT_0f_Ch@r@cter$
export DATABASE_URL=sqlite:///location/database/hopefully/not/sql.lite
export DJANGO_DEBUG=False
```

Then run the following commands to collect all the static assets, setup the
database and kick off the webserver:

```bash
python manage.py collectstatic
python manage.py migrate
python manage.py runserver
```

**Note:** It is not recommended to run the Django dev server (runserver) in
production.

Please use a combination of apache/nginx and gunicorn. Some requirement files
with the necessary pip dependencies have been added to the repository to help.

Below is what is used for heroku:

```bash
pip install -r requirements/heroku.txt
```

There are many additional steps needed to get this setup running which is not in
scope of this readme.

Contributing
------------

Please read
[CONTRIBUTING.md](https://github.com/mvillis/measure-mate/blob/master/CONTRIBUTING.md)
if you wish to contribute.
