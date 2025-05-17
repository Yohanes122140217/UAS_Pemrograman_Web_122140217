# backend/app.py

from wsgiref.simple_server import make_server
from pyramid.config import Configurator
from pyramid.response import Response
from pyramid.view import view_config
import json
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from pyramid.renderers import JSON
from pyramid.cors import includeme as include_cors

# Sample product data (will be replaced with database later)
PRODUCTS = [
    {
        "id": 1,
        "name": "Laptop",
        "price": 999.99,
        "description": "High-performance laptop for students",
        "image": "https://via.placeholder.com/300",
        "category": "Electronics"
    },
    {
        "id": 2,
        "name": "Textbook",
        "price": 79.99,
        "description": "Computer Science textbook",
        "image": "https://via.placeholder.com/300",
        "category": "Books"
    },
    {
        "id": 3,
        "name": "Backpack",
        "price": 49.99,
        "description": "Durable backpack for daily use",
        "image": "https://via.placeholder.com/300",
        "category": "Accessories"
    }
]

# Define views
@view_config(route_name='home', renderer='json')
def home(request):
    return {'message': 'Welcome to E-Commerce API'}

@view_config(route_name='products', renderer='json')
def get_products(request):
    return {'products': PRODUCTS}

@view_config(route_name='product', renderer='json')
def get_product(request):
    try:
        product_id = int(request.matchdict['id'])
        product = next((p for p in PRODUCTS if p['id'] == product_id), None)
        if product:
            return product
        else:
            return HTTPNotFound(json_body={'error': 'Product not found'})
    except ValueError:
        return HTTPBadRequest(json_body={'error': 'Invalid product ID'})

def main():
    with Configurator() as config:
        # Include CORS support
        config.include('pyramid_cors')
        config.add_cors_preflight_handler(
            allow_origins=['http://localhost:3000'],
            allow_methods=['GET', 'POST', 'PUT', 'DELETE'],
            allow_headers=['Content-Type', 'Authorization'],
            max_age=86400
        )
        
        # Add routes
        config.add_route('home', '/')
        config.add_route('products', '/api/products')
        config.add_route('product', '/api/products/{id}')
        
        # Scan for view configurations
        config.scan()
        
        # Create WSGI app
        app = config.make_wsgi_app()
    
    return app

if __name__ == '__main__':
    app = main()
    server = make_server('0.0.0.0', 8000, app)
    print('Starting server on http://0.0.0.0:8000')
    server.serve_forever()