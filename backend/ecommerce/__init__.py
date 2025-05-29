# __init__.py
from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from pyramid.renderers import JSON

from .models.meta import Base, DBSession
from .security import cors_tween_factory, prevent_logged_in_user_tween_factory

def main(global_config, **settings):
    config = Configurator(settings=settings)

    # Database setup
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine

    # Tweens: CORS and block logged-in users from login/signup
    config.add_tween('ecommerce.security.cors_tween_factory')
    config.add_tween('ecommerce.security.prevent_logged_in_user_tween_factory')

    config.include('pyramid_tm')

    # Routes
    config.add_route('home', '/')
    config.add_route('login', '/login')
    config.add_route('signup', '/signup')
    # config.add_route('image_upload_auth', '/api/imagekit/auth')
    # … other routes …

    # ImageKit routes
    config.add_route('create_product', '/api/products')
    config.add_route('get_products', '/api/get-products')
    config.add_route('imagekit_auth', '/api/imagekit/auth')
    config.add_route('get_product_detail', '/api/products/{product_id}')
    # Seller
    config.add_route('get_seller_products', '/api/seller/products')


    config.add_renderer('json', JSON())

    # from .views import product
    config.scan()

    return config.make_wsgi_app()
