# backend/ecommerce/views/product.py
import json
from ..models.user import User
from pyramid.view import view_config
from pyramid.response import Response
from ..models.meta import DBSession
from ..models.product import Product
from ..schemas.product import ProductSchema
from marshmallow import ValidationError
from pyramid.httpexceptions import HTTPUnauthorized, HTTPForbidden, HTTPNotFound, HTTPNoContent
from ..security import get_user_id_from_jwt
from sqlalchemy import cast, String
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_
from sqlalchemy import func

@view_config(route_name='create_product', renderer='json', request_method='POST')
def create_product(request):
    try:
        # Debug: Check if the request data is received correctly
        print("Received data:", request.json_body)

        # Parse and validate the data with Marshmallow
        data = request.json_body
        product_data = ProductSchema().load(data)  # Deserialize and validate data
        
        user_id = get_user_id_from_jwt(request)
        user = DBSession.query(User).get(user_id)
        if not user:
            return HTTPUnauthorized(json_body={'error': 'User not authenticated'})
        
        product_data['seller'] = user.username
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
            body=json.dumps({'errors': err.messages}),
            status=400,
            content_type='application/json',
            charset='utf-8'
        )
    except Exception as e:
        # General exception handling
        print("Error:", str(e))
        return Response(
            body=json.dumps({'error': 'An error occurred while adding the product.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
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
            'seller' : p.seller,
            'stock' : p.stock
        })

    return result



def get_product_by_id(request, product_id):
    product = request.dbsession.query(Product).filter(Product.id == int(product_id)).first()
    if product:
        return product.to_dict()
    return None



@view_config(route_name='get_product_detail', renderer='json', request_method='GET')
def product_detail_api_view(request):
    product_id = request.matchdict.get('product_id')

    product = DBSession.query(Product).filter(Product.id == int(product_id)).first()

    if not product:
        request.response.status = 404
        return {"error": "Product not found"}

    return {
        'id': product.id,
        'name': product.name,
        'price': product.price,
        'originalPrice': product.original_price,
        'image': product.image_url or '/api/placeholder/300/200',
        'rating': product.rating,
        'sold': product.sold,
        'seller': product.seller,
        'description': product.description,
        'stock': product.stock
    }


@view_config(route_name='get_seller_products', renderer='json', request_method='GET')
def get_seller_products(request):
    user_id = get_user_id_from_jwt(request)
    if not user_id:
        return HTTPUnauthorized(json_body={"error": "Unauthorized"})

    user = DBSession.query(User).get(user_id)
    if not user:
        return HTTPUnauthorized(json_body={"error": "User not found"})

    username = user.username
    print(f"DEBUG: User ID from token: {user_id}")
    print(f"DEBUG: Username from DB: '{username}' (len={len(username)})")

    # Query products by seller username exactly
    products = DBSession.query(Product).filter(Product.seller == username).all()

    print(f"DEBUG: Number of products found: {len(products)}")
    for p in products:
        print(f"DEBUG: Product ID={p.id}, Seller='{p.seller}', Name='{p.name}'")

    result = []
    for p in products:
        result.append({
            'id': p.id,
            'name': p.name,
            'price': p.price,
            'image': p.image_url or '/api/placeholder/300/200',
            'rating': p.rating,
            'sold': p.sold,
            'seller': p.seller,
            'stock': p.stock
        })

    return result


# NEW


@view_config(route_name='edit_product', renderer='json', request_method='PUT')
def edit_product(request):
    product_id = request.matchdict.get('product_id')
    try:
        user_id = get_user_id_from_jwt(request)
        if not user_id:
            return HTTPUnauthorized(json_body={'error': 'Authentication required'})

        user = DBSession.query(User).get(user_id)
        if not user:
            return HTTPUnauthorized(json_body={'error': 'User not found'})

        product = DBSession.query(Product).filter(Product.id == int(product_id)).first()
        if not product:
            return HTTPNotFound(json_body={'error': 'Product not found'})

        if product.seller != user.username:
            return HTTPForbidden(json_body={'error': 'You are not authorized to edit this product'})

        data = request.json_body
        product_data = ProductSchema().load(data, partial=True)

        for key, value in product_data.items():
            setattr(product, key, value)

        DBSession.flush() # Commit changes to the database
        return ProductSchema().dump(product)

    except ValidationError as err:
        return Response(
            body=json.dumps({'errors': err.messages}),
            status=400,
            content_type='application/json',
            charset='utf-8'
        )
    except SQLAlchemyError as e:
        DBSession.rollback() # Rollback in case of DB error
        return Response(
            body=json.dumps({'error': 'A database error occurred while updating the product.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )
    except Exception as e:
        return Response(
            body=json.dumps({'error': 'An unexpected error occurred while updating the product.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )


# NEW

@view_config(route_name='delete_product', renderer='json', request_method='DELETE')
def delete_product(request):
    product_id = request.matchdict.get('product_id')
    print(f"DEBUG: DELETE request received for product ID: {product_id}") # ADD THIS

    try:
        # ... (your existing auth logic) ...

        # Check the parsed product_id type and value
        try:
            int_product_id = int(product_id)
            print(f"DEBUG: Parsed product_id as integer: {int_product_id}") # ADD THIS
        except ValueError:
            print(f"ERROR: product_id '{product_id}' is not a valid integer.")
            return Response(
                body=json.dumps({'error': 'Invalid product ID format.'}),
                status=400,
                content_type='application/json',
                charset='utf-8'
            )

        # 2. Fetch the existing product
        product = DBSession.query(Product).filter(Product.id == int_product_id).first() # Use int_product_id
        if not product:
            print(f"DEBUG: Product with ID {int_product_id} not found in DB.") # ADD THIS
            return HTTPNotFound(json_body={'error': 'Product not found'}) # Ensure json_body is set

        # ... (rest of your logic) ... used for successful DELETE requests where no content is returned.
        return HTTPNoContent()

    except SQLAlchemyError as e:
        DBSession.rollback() # Rollback in case of DB error
        print(f"Database error during product deletion: {e}")
        return Response(
            body=json.dumps({'error': 'A database error occurred while deleting the product.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )
    except Exception as e:
        print(f"General error during product deletion: {e}")
        return Response(
            body=json.dumps({'error': 'An unexpected error occurred while deleting the product.'}),
            status=500,
            content_type='application/json',
            charset='utf-8'
        )
    

@view_config(route_name='search_products', renderer='json', request_method='GET')
def search_products_view(request):
    search_query_param = request.params.get('q', '').strip() # Get 'q' query parameter
    
    # For backend debugging:
    print(f"[SearchView] Received search request. Query parameter 'q': '{search_query_param}'")

    if not search_query_param:
        print("[SearchView] Search query is empty. Returning empty list.")
        return [] 

    try:
        # Prepare for a case-insensitive LIKE search
        # For PostgreSQL, you can use .ilike()
        # For SQLite and other DBs, using lower() on both sides is more portable
        search_term_for_like = f"%{search_query_param.lower()}%"
        
        products = DBSession.query(Product).filter(
            or_(
                func.lower(Product.name).like(search_term_for_like),
                func.lower(Product.description).like(search_term_for_like),
            )
        ).all()
        
        print(f"[SearchView] Found {len(products)} products for query '{search_query_param}'")
        return ProductSchema(many=True).dump(products)

    except SQLAlchemyError as e:
        DBSession.rollback()
        print(f"[SearchView] SQLAlchemyError during product search: {e}")
        request.response.status = 500
        return {'error': 'A database error occurred while searching for products.'}
    except Exception as e:
        print(f"[SearchView] Unexpected error during product search: {e}")
        request.response.status = 500
        return {'error': 'An unexpected error occurred while searching for products.'}
