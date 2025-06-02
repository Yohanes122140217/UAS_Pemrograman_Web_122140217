# __init__.py
from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from pyramid.renderers import JSON

from .models.meta import Base, DBSession
# Assuming your security tweens are correctly defined and imported
# from .security import cors_tween_factory, prevent_logged_in_user_tween_factory 

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

    # User routes
    config.add_route('home', '/') 
    config.add_route('login', '/login') 
    config.add_route('signup', '/signup') 
    config.add_route('get_user_profile', '/api/user/profile', request_method='GET') 
    config.add_route('update_user_profile', '/api/user/profile', request_method='PUT') 
    config.add_route('update_user_password', '/api/user/password', request_method='PUT') 
    config.add_route('delete_account', '/api/user/account', request_method='DELETE') 

    # ImageKit routes
    config.add_route('imagekit_auth', '/api/imagekit/auth') 

    # Products routes
    config.add_route('create_product', '/api/products', request_method='POST') 
    config.add_route('get_products', '/api/get-products', request_method='GET') 
    config.add_route('get_product_detail', '/api/products/{product_id}', request_method='GET') 
    config.add_route('edit_product', '/api/products/{product_id}', request_method='PUT') 
    config.add_route('delete_product', '/api/products/{product_id}', request_method='DELETE') 
    
    # Seller routes
    config.add_route('get_seller_products', '/api/seller/products') 

    # --- Add Cart Routes Below ---
    # Cart
    config.add_route('get_cart', '/api/cart', request_method='GET')
    config.add_route('add_item_to_cart', '/api/cart/items', request_method='POST') # Add item to cart
    # For specific cart items, include an item_id placeholder. \d+ ensures it's an integer.
    config.add_route('update_cart_item_quantity', '/api/cart/items/{item_id:\d+}', request_method='PUT')
    config.add_route('remove_cart_item', '/api/cart/items/{item_id:\d+}', request_method='DELETE')
    config.add_route('clear_cart', '/api/cart', request_method='DELETE') # Clears all items from the cart
    config.add_route('search_products', '/api/search/products', request_method='GET')
    

    config.add_renderer('json', JSON())

    config.scan() # This will pick up your new view configurations in views/cart.py

    return config.make_wsgi_app()