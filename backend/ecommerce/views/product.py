# backend/ecommerce/views/product.py
import json
from ..models.user import User
from pyramid.view import view_config
from pyramid.response import Response
from ..models.meta import DBSession
from ..models.product import Product
from ..schemas.product import ProductSchema
from marshmallow import ValidationError
from pyramid.httpexceptions import HTTPUnauthorized, HTTPForbidden, HTTPNotFound, HTTPNoContent, HTTPBadRequest
from ..security import get_user_id_from_jwt
from sqlalchemy import cast, String
from sqlalchemy.exc import SQLAlchemyError
from sqlalchemy import or_
from sqlalchemy import func
from ..models.cart import CartItem

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
    product_id_str = request.matchdict.get('product_id')
    print(f"DEBUG: DELETE request received for product ID: {product_id_str}")

    try:
        # 1. Authenticate user
        user_id = get_user_id_from_jwt(request)
        if not user_id:
            print("DEBUG: delete_product - Authentication failed. No user_id from JWT.")
            raise HTTPUnauthorized(json_body={'error': 'Authentication required'})
        
        user = DBSession.query(User).get(user_id)
        if not user:
            print(f"DEBUG: delete_product - Authenticated user_id {user_id} not found in DB.")
            raise HTTPUnauthorized(json_body={'error': 'Authenticated user not found'})
        
        print(f"DEBUG: delete_product - Authenticated user: {user.username} (ID: {user.id})")

        # 2. Validate product_id format
        try:
            int_product_id = int(product_id_str)
            print(f"DEBUG: delete_product - Parsed product_id as integer: {int_product_id}")
        except (ValueError, TypeError):
            print(f"ERROR: delete_product - product_id '{product_id_str}' is not a valid integer.")
            raise HTTPBadRequest(json_body={'error': 'Invalid product ID format.'})

        # 3. Fetch the existing product
        product = DBSession.query(Product).filter(Product.id == int_product_id).first()
        if not product:
            print(f"DEBUG: delete_product - Product with ID {int_product_id} not found in DB.")
            raise HTTPNotFound(json_body={'error': 'Product not found'})
        
        print(f"DEBUG: delete_product - Product found: {product.name}, Seller: {product.seller}")

        # 4. Authorize: Check if the logged-in user is the seller of the product
        if product.seller != user.username:
            print(f"DEBUG: delete_product - Forbidden. User '{user.username}' is not the seller of product '{product.name}' (seller: '{product.seller}').")
            raise HTTPForbidden(json_body={'error': 'You are not authorized to delete this product.'})

        # 5. Delete associated CartItems first to avoid foreign key constraint errors
        #    The `synchronize_session` strategy might need adjustment based on your specific setup or errors.
        #    'fetch' is generally safe but can be less performant on many rows.
        #    'evaluate' might work if no complex ORM state is involved with CartItem.
        #    False can sometimes lead to issues if the session has pending changes on those items.
        deleted_cart_item_count = DBSession.query(CartItem).filter(CartItem.product_id == int_product_id).delete(synchronize_session='fetch')
        if deleted_cart_item_count > 0:
            print(f"DEBUG: delete_product - Deleted {deleted_cart_item_count} associated cart items for product ID {int_product_id}.")
            DBSession.flush() # Flush deletion of cart items

        # TODO: Consider deleting associated images from ImageKit if applicable
        # if product.imagekit_file_id:
        #     try:
        #         # imagekit.delete_file(product.imagekit_file_id) # Assuming you have 'imagekit' object
        #         print(f"ImageKit image {product.imagekit_file_id} deleted for product {product.id}.")
        #     except Exception as ik_err:
        #         print(f"WARNING: Failed to delete ImageKit image {product.imagekit_file_id}: {ik_err}")
        
        # 6. Now delete the product itself
        DBSession.delete(product)
        DBSession.flush() 
        print(f"DEBUG: delete_product - Product with ID {int_product_id} ({product.name}) marked for deletion and flushed.")
        
        # pyramid_tm will handle commit on successful request completion
        return HTTPNoContent()

    except (HTTPBadRequest, HTTPUnauthorized, HTTPNotFound, HTTPForbidden) as e:
        error_content = e.json if hasattr(e, 'json') else e.detail
        print(f"DEBUG: delete_product - HTTP Exception Caught: {type(e).__name__} - {error_content}")
        return e
    except SQLAlchemyError as e:
        DBSession.rollback() 
        # CRITICAL: Log the actual SQLAlchemyError 'e' to understand the root cause
        print(f"DATABASE ERROR during product deletion (product_id: {product_id_str}): {e}")
        # You might want to inspect e.orig for more specific DB driver error details
        # For example: print(f"Original DB error: {e.orig}")
        request.response.status = 500 # Ensure status is set before returning dict for renderer
        return {'error': 'A database error occurred while deleting the product. Please check server logs for details.'}
    except Exception as e:
        DBSession.rollback() 
        print(f"GENERAL ERROR during product deletion (product_id: {product_id_str}): {e}")
        request.response.status = 500
        return {'error': 'An unexpected error occurred while deleting the product.'}
    

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
