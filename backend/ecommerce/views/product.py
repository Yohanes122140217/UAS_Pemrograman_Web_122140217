# backend/ecommerce/views/product.py
import json
from pyramid.view import view_config
from pyramid.response import Response
from ..models.meta import DBSession
from ..models.product import Product
from ..schemas.product import ProductSchema
from marshmallow import ValidationError

@view_config(route_name='create_product', renderer='json', request_method='POST')
def create_product(request):
    try:
        # Debug: Check if the request data is received correctly
        print("Received data:", request.json_body)

        # Parse and validate the data with Marshmallow
        data = request.json_body
        product_data = ProductSchema().load(data)  # Deserialize and validate data

        # Create a new product object and save to DB
        product = Product(**product_data)
        DBSession.add(product)
        DBSession.flush()  # Save product and get its ID
        print(f"Product {product.name} added successfully with ID {product.id}")

        # Return the serialized product data
        return ProductSchema().dump(product)
    except ValidationError as err:
        # If validation fails, print the errors and return them to the frontend
        print("Validation error:", err.messages)
        return Response(
            json.dumps({'errors': err.messages}),
            status=400,
            content_type='application/json'
        )
    except Exception as e:
        # General exception handling
        print("Error:", str(e))
        return Response(
            json.dumps({'error': 'An error occurred while adding the product.'}),
            status=500,
            content_type='application/json'
        )



@view_config(route_name='get_products', renderer='json', request_method='GET')
def products_api_view(request):
    products = DBSession.query(Product).all()

    # Serialize product objects into dictionaries
    result = []
    for p in products:
        result.append({
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'originalPrice': p.original_price,
            'image': p.image_url or '/api/placeholder/300/200',
            'rating': p.rating,
            'sold': p.sold,
        })

    return result