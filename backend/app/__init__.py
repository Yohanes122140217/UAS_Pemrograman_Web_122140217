# backend/app/__init__.py or main.py (wherever Pyramid config is)

def main(global_config, **settings):
    from pyramid.config import Configurator

    config = Configurator(settings=settings)

    # Add routes
    config.add_route('signup', '/api/signup')
    # Defines URL /api/signup and names it 'signup'.

    # Add view
    config.scan('backend.app.routers.users')
    # Automatically finds all @view_config decorators in
    # backend.app.routers.users and registers views.

    return config.make_wsgi_app()
    # Returns the final WSGI application to run your Pyramid app.
