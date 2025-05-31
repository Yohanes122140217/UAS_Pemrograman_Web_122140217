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

    # User
    config.add_route('home', '/')
    config.add_route('login', '/login')
    config.add_route('signup', '/signup')
    config.add_route('get_user_profile', '/api/user/profile', request_method='GET')
    config.add_route('update_user_profile', '/api/user/profile', request_method='PUT')
    config.add_route('update_user_password', '/api/user/password', request_method='PUT')
    config.add_route('delete_account', '/api/user/account', request_method='DELETE')

    # ImageKit routes
    config.add_route('imagekit_auth', '/api/imagekit/auth')

    # Products
    config.add_route('create_product', '/api/products', request_method='POST')
    config.add_route('get_products', '/api/get-products', request_method='GET')
    config.add_route('get_product_detail', '/api/products/{product_id}', request_method='GET')
    config.add_route('edit_product', '/api/products/{product_id}', request_method='PUT')
    config.add_route('delete_product', '/api/products/{product_id}', request_method='DELETE')
    
    # Seller
    config.add_route('get_seller_products', '/api/seller/products')
    
    config.add_renderer('json', JSON())

    # from .views import product
    config.scan()

    return config.make_wsgi_app()
