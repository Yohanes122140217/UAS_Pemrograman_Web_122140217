from pyramid.config import Configurator
from sqlalchemy import engine_from_config
from .models.meta import Base, DBSession
from .security import cors_tween_factory

def main(global_config, **settings):
    """ This function returns a Pyramid WSGI application."""
    
    # Setup DB engine
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine
    
    config = Configurator(settings=settings)

    # Add CORS middleware
    config.add_tween('ecommerce.security.cors_tween_factory')
    
    # Include pyramid_tm for transaction management
    config.include('pyramid_tm')
    
    # Add routes
    config.add_route('signup', '/signup')

    config.add_route('home', '/')
    
    # Scan views and models for decorators
    config.scan()
    return config.make_wsgi_app()