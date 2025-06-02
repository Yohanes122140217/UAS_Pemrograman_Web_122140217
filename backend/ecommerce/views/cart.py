# backend/ecommerce/views/cart.py
import json
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import (
    HTTPBadRequest,
    HTTPNotFound,
    HTTPUnauthorized,
    HTTPForbidden,
    HTTPNoContent
)
from marshmallow import ValidationError
from sqlalchemy.exc import SQLAlchemyError

from ..models.meta import DBSession
from ..models.user import User
from ..models.product import Product
from ..models.cart import Cart, CartItem
from ..schemas.cart import CartSchema, CartItemAddSchema, CartItemUpdateSchema
from ..security import get_user_id_from_jwt

# --- Helper Function ---
def get_or_create_active_cart(dbsession, user_id: int) -> Cart:
    print(f"[CartHelper] Attempting to get/create cart for user_id: {user_id}")
    cart = dbsession.query(Cart).filter(Cart.user_id == user_id).first()
    if not cart:
        print(f"[CartHelper] No existing cart found for user_id: {user_id}. Creating new one.")
        cart = Cart(user_id=user_id)
        dbsession.add(cart)
        try:
            dbsession.flush()  # Flush to get cart.id
            print(f"[CartHelper] New cart created with ID: {cart.id} for user_id: {user_id}")
        except Exception as e:
            print(f"[CartHelper] ERROR flushing new cart: {e}")
            dbsession.rollback() # Rollback if flush fails
            raise # Re-raise the exception to be caught by the view
    else:
        print(f"[CartHelper] Found existing cart with ID: {cart.id} for user_id: {user_id}")
    return cart

# --- Cart Views ---

@view_config(route_name='get_cart', renderer='json', request_method='GET', permission='view')
def get_cart_view(request):
    print("[GetCartView] Received request for get_cart")
    try:
        user_id = get_user_id_from_jwt(request)
        if not user_id:
            print("[GetCartView] Authentication failed: No user_id from JWT.")
            raise HTTPUnauthorized(json_body={'error': 'Authentication required'})

        print(f"[GetCartView] Authenticated user_id: {user_id}")
        cart = get_or_create_active_cart(DBSession, user_id)
        
        print(f"[GetCartView] Cart retrieved/created for user_id: {user_id}, Cart ID: {cart.id if cart else 'None'}")
        if not cart: 
             print("[GetCartView] ERROR: Cart is None after get_or_create_active_cart")
             raise Exception("Failed to retrieve or create cart internally.")

        schema_result = CartSchema().dump(cart)
        print(f"[GetCartView] Schema dump result: {schema_result}")
        return schema_result
        
    except HTTPUnauthorized as e:
        # Corrected logging for HTTP exceptions
        error_content = e.json if hasattr(e, 'json') else e.detail
        print(f"[GetCartView] HTTPUnauthorized Caught: Detail: {e.detail} - JSON Content: {error_content}")
        return e 
    except SQLAlchemyError as e: 
        DBSession.rollback() 
        print(f"[GetCartView] SQLAlchemyError: {e}")
        return HTTPBadRequest(json_body={'error': 'Database error while retrieving cart.'})
    except Exception as e:
        print(f"[GetCartView] UNHANDLED EXCEPTION: {type(e).__name__} - {e}")
        return Response(
            json.dumps({'error': 'Could not retrieve cart due to an unexpected server error.'}), 
            status=500, 
            content_type='application/json'
        )


@view_config(route_name='add_item_to_cart', renderer='json', request_method='POST', permission='edit_cart')
def add_item_to_cart_view(request):
    print("[AddItemView] Received request to add item.")
    try:
        user_id = get_user_id_from_jwt(request)
        if not user_id:
            print("[AddItemView] Auth failed.")
            raise HTTPUnauthorized(json_body={'error': 'Authentication required'})
        print(f"[AddItemView] User ID: {user_id}")

        json_body = request.json_body
        print(f"[AddItemView] Request JSON body: {json_body}")
        validated_data = CartItemAddSchema().load(json_body)
        print(f"[AddItemView] Validated data: {validated_data}")
        
        product_id = validated_data['product_id']
        quantity_to_add = validated_data['quantity']

        product = DBSession.query(Product).get(product_id)
        if not product:
            print(f"[AddItemView] Product with ID {product_id} not found.")
            raise HTTPNotFound(json_body={'error': f'Product with ID {product_id} not found.'})
        print(f"[AddItemView] Product found: {product.name}, Stock: {product.stock}, Price: {product.price}")

        if product.stock is not None and product.stock < quantity_to_add:
            print(f"[AddItemView] Not enough stock for {product.name}. Available: {product.stock}, Requested: {quantity_to_add}")
            raise HTTPBadRequest(json_body={'error': f'Not enough stock for {product.name}. Available: {product.stock}'})

        cart = get_or_create_active_cart(DBSession, user_id)
        print(f"[AddItemView] Cart ID for operation: {cart.id}")
        
        existing_item = DBSession.query(CartItem).filter_by(cart_id=cart.id, product_id=product_id).first()

        if existing_item:
            new_quantity = existing_item.quantity + quantity_to_add
            print(f"[AddItemView] Existing item found. Old Qty: {existing_item.quantity}, Adding: {quantity_to_add}, New Qty: {new_quantity}")
            if product.stock is not None and product.stock < new_quantity:
                print(f"[AddItemView] Stock check fail for update. Stock: {product.stock}, Required: {new_quantity}")
                raise HTTPBadRequest(json_body={'error': f'Cannot add {quantity_to_add} more of {product.name}. Total would exceed stock. In cart: {existing_item.quantity}, Available: {product.stock}'})
            existing_item.quantity = new_quantity
        else:
            print(f"[AddItemView] New item. Product ID: {product_id}, Qty: {quantity_to_add}")
            if product.stock is not None and product.stock < quantity_to_add: 
                 print(f"[AddItemView] Stock check fail for new item. Stock: {product.stock}, Required: {quantity_to_add}")
                 raise HTTPBadRequest(json_body={'error': f'Not enough stock for {product.name} to add to cart. Available: {product.stock}'})
            
            if product.price is None: 
                print(f"[AddItemView] ERROR: Product {product.name} (ID: {product.id}) has no price defined.")
                raise HTTPBadRequest(json_body={'error': f'Cannot add product {product.name} to cart as it has no price.'})

            new_item = CartItem(
                cart_id=cart.id,
                product_id=product_id,
                quantity=quantity_to_add,
                price_at_add=product.price 
            )
            DBSession.add(new_item)
            print(f"[AddItemView] New CartItem object created: {new_item}")
        
        DBSession.flush() 
        print(f"[AddItemView] DBSession flushed. Cart ID: {cart.id}, User ID: {user_id}")
        
        refreshed_cart = DBSession.query(Cart).filter(Cart.id == cart.id).one() # .one() will raise if not found
        return CartSchema().dump(refreshed_cart)

    except ValidationError as err:
        print(f"[AddItemView] Validation Error: {err.messages}")
        return HTTPBadRequest(json_body={'errors': err.messages})
    except (HTTPUnauthorized, HTTPNotFound, HTTPBadRequest, HTTPForbidden) as e:
        # Corrected logging for HTTP exceptions
        error_content = e.json if hasattr(e, 'json') else e.detail
        print(f"[AddItemView] HTTP Exception Caught: {type(e).__name__} - Detail: {e.detail} - JSON Content: {error_content}")
        return e 
    except SQLAlchemyError as e:
        DBSession.rollback()
        print(f"[AddItemView] SQLAlchemyError: {e}")
        return HTTPBadRequest(json_body={'error': 'Database error processing cart.'})
    except Exception as e:
        DBSession.rollback() 
        print(f"[AddItemView] UNHANDLED EXCEPTION: {type(e).__name__} - {e}")
        return HTTPBadRequest(json_body={'error': 'Could not add item to cart due to a server error.'})


@view_config(route_name='update_cart_item_quantity', renderer='json', request_method='PUT', permission='edit_cart')
def update_cart_item_quantity_view(request):
    print("[UpdateItemView] Received request.")
    try:
        user_id = get_user_id_from_jwt(request)
        if not user_id:
            print("[UpdateItemView] Auth failed.")
            raise HTTPUnauthorized(json_body={'error': 'Authentication required'})
        print(f"[UpdateItemView] User ID: {user_id}")

        cart_item_id_str = request.matchdict.get('item_id')
        if not cart_item_id_str:
            print("[UpdateItemView] item_id missing from URL.")
            raise HTTPBadRequest(json_body={'error': 'Cart item ID missing in URL.'})
        cart_item_id = int(cart_item_id_str)
        print(f"[UpdateItemView] Cart Item ID from URL: {cart_item_id}")

        json_data = request.json_body
        print(f"[UpdateItemView] Request JSON body: {json_data}")
        validated_data = CartItemUpdateSchema().load(json_data)
        new_quantity = validated_data['quantity']
        print(f"[UpdateItemView] Validated new quantity: {new_quantity}")

        cart_item = DBSession.query(CartItem).get(cart_item_id)
        if not cart_item:
            print(f"[UpdateItemView] CartItem with ID {cart_item_id} not found.")
            raise HTTPNotFound(json_body={'error': 'Cart item not found.'})
        print(f"[UpdateItemView] CartItem found: {cart_item}")

        cart = DBSession.query(Cart).filter_by(id=cart_item.cart_id, user_id=user_id).first()
        if not cart:
            print(f"[UpdateItemView] Forbidden: CartItem {cart_item_id} does not belong to user {user_id}.")
            raise HTTPForbidden(json_body={'error': 'This cart item does not belong to you.'})
        print(f"[UpdateItemView] Cart verified for user. Cart ID: {cart.id}")
        
        product = DBSession.query(Product).get(cart_item.product_id)
        if not product:
            print(f"[UpdateItemView] Product for CartItem {cart_item_id} (Product ID: {cart_item.product_id}) not found.")
            raise HTTPNotFound(json_body={'error': 'Associated product not found, cannot update item.'})
        print(f"[UpdateItemView] Product found: {product.name}, Stock: {product.stock}")

        if product.stock is not None and product.stock < new_quantity:
            print(f"[UpdateItemView] Stock check fail. Stock: {product.stock}, Required: {new_quantity}")
            raise HTTPBadRequest(json_body={'error': f'Not enough stock for {product.name}. Available: {product.stock}'})

        if new_quantity == 0: # If client can send 0 to mean delete
            DBSession.delete(cart_item)
            print(f"[UpdateItemView] CartItem {cart_item_id} quantity was 0, item deleted. Flushed.")
        else:
            cart_item.quantity = new_quantity
            print(f"[UpdateItemView] CartItem {cart_item_id} quantity updated to {new_quantity}. Flushed.")
        
        DBSession.flush()

        refreshed_cart = DBSession.query(Cart).filter(Cart.id == cart.id).one() # .one() will raise if not found
        return CartSchema().dump(refreshed_cart)

    except ValueError: 
        print("[UpdateItemView] ValueError: Invalid cart_item_id format.")
        return HTTPBadRequest(json_body={'error': 'Invalid cart item ID format.'})
    except ValidationError as err:
        print(f"[UpdateItemView] Validation Error: {err.messages}")
        return HTTPBadRequest(json_body={'errors': err.messages})
    except (HTTPUnauthorized, HTTPNotFound, HTTPBadRequest, HTTPForbidden) as e:
        # Corrected logging for HTTP exceptions
        error_content = e.json if hasattr(e, 'json') else e.detail
        print(f"[UpdateItemView] HTTP Exception Caught: {type(e).__name__} - Detail: {e.detail} - JSON Content: {error_content}")
        return e
    except SQLAlchemyError as e:
        DBSession.rollback()
        print(f"[UpdateItemView] SQLAlchemyError: {e}")
        return HTTPBadRequest(json_body={'error': 'Database error updating cart item.'})
    except Exception as e:
        DBSession.rollback()
        print(f"[UpdateItemView] UNHANDLED EXCEPTION: {type(e).__name__} - {e}")
        return HTTPBadRequest(json_body={'error': 'Could not update cart item due to a server error.'})