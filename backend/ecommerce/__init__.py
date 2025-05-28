# from pyramid.config import Configurator
# from sqlalchemy import engine_from_config
# from .models.meta import Base, DBSession
# from .security import cors_tween_factory, prevent_logged_in_user

# def main(global_config, **settings):
#     """ This function returns a Pyramid WSGI application."""

#     config = Configurator(settings=settings)

    
#     # Setup DB engine
#     engine = engine_from_config(settings, 'sqlalchemy.')
#     DBSession.configure(bind=engine)
#     Base.metadata.bind = engine
    

#     # Add CORS middleware
#     config.add_tween('ecommerce.security.cors_tween_factory', over=None)
#     config.add_tween('ecommerce.security.prevent_logged_in_user')
    
#     # Include pyramid_tm for transaction management
#     config.include('pyramid_tm')
    
#     # Add routes
#     config.add_route('home', '/')
#     config.add_route('login', '/login')
#     config.add_route('signup', '/signup')

    
#     # Scan views and models for decorators
#     config.scan()
#     return config.make_wsgi_app()

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
    config.add_tween('ecommerce.security.cors_tween_factory', over=None)
    config.add_tween('ecommerce.security.prevent_logged_in_user_tween_factory')

    config.include('pyramid_tm')

    # Routes
    config.add_route('home', '/')
    config.add_route('login', '/login')
    config.add_route('signup', '/signup')
    # config.add_route('image_upload_auth', '/api/imagekit/auth')
    # … other routes …

    # ImageKit routes
    # config.add_route('list_products', '/api/products')
    config.add_route('create_product', '/api/products')
    config.add_route('get_products', '/api/get-products')
    config.add_route('imagekit_auth', '/api/imagekit/auth')

    config.add_renderer('json', JSON())


    config.scan()
    return config.make_wsgi_app()
