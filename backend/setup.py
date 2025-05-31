from setuptools import setup, find_packages

setup(
    name='ecommerce',
    version='0.1',
    packages=find_packages(),
    install_requires=[
        'pyramid',
        'waitress',
        'SQLAlchemy',
        'psycopg2-binary',
        'transaction',
        'pyramid_tm',
        'marshmallow',
        # add other dependencies you use
    ],
    entry_points={
        'paste.app_factory': [
            'main = ecommerce:main',
        ],
    },
)
