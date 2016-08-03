from setuptools import setup, find_packages

import versioneer

setup(
    name='measure-mate',
    description='A tool to track maturity assessments for your team.',
    long_description=open('README.md').read(),
    author='Michael Villis',
    author_email='',
    url='https://github.com/mvillis/measure-mate/',
    packages=find_packages('.'),
    classifiers=[
      'License :: OSI Approved :: MIT License',
      'Programming Language :: Python',
      'Programming Language :: JavaScript',
      'Development Status :: 4 - Beta',
      'Environment :: Web Environment',
      'Intended Audience :: End Users/Desktop',
      'Intended Audience :: Developers',
      'Framework :: Django :: 1.9',
      'Topic :: Sociology'
      'Topic :: Office/Business'
    ],
    install_requires=[
        'pip>=8.1.2',
    ],
    version=versioneer.get_version(),
    cmdclass=versioneer.get_cmdclass(),
)
