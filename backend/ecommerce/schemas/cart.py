# backend/ecommerce/schemas/cart.py
from marshmallow import Schema, fields, validate
from .product import ProductSchema # Assuming product.py (schema) is in the same directory

class CartItemSchema(Schema):
    """
    Schema for an individual item within a cart.
    This is typically used when displaying the contents of a cart.
    """
    id = fields.Int(dump_only=True) # The CartItem's own ID in the database

    # Nested ProductSchema to display full product details for the item
    product = fields.Nested(ProductSchema, dump_only=True)
    
    quantity = fields.Int(required=True, validate=validate.Range(min=1), dump_only=True) # Quantity of this product in the cart
    
    # Price of the single unit of the product at the time it was added to the cart
    price_at_add = fields.Float(dump_only=True) 
    
    added_at = fields.DateTime(dump_only=True) # When the item was added

    # Subtotal for this cart item (price_at_add * quantity)
    item_total = fields.Method("get_item_total", dump_only=True)

    def get_item_total(self, obj):
        # obj is the CartItem SQLAlchemy model instance
        if obj and hasattr(obj, 'price_at_add') and hasattr(obj, 'quantity'):
            return round(obj.price_at_add * obj.quantity, 2)
        return 0.0

class CartSchema(Schema):
    """
    Schema for the shopping cart itself.
    """
    id = fields.Int(dump_only=True) # The Cart's ID
    user_id = fields.Int(dump_only=True) # ID of the user who owns the cart
    
    # List of items in the cart, using the CartItemSchema
    items = fields.List(fields.Nested(CartItemSchema), dump_only=True)
    
    created_at = fields.DateTime(dump_only=True)
    updated_at = fields.DateTime(dump_only=True)

    # Calculated fields for cart summary
    total_items_count = fields.Method("get_total_items_count", dump_only=True)
    grand_total = fields.Method("get_grand_total", dump_only=True)

    def get_total_items_count(self, obj):
        # obj is the Cart SQLAlchemy model instance
        if obj and hasattr(obj, 'items'):
            return sum(item.quantity for item in obj.items)
        return 0

    def get_grand_total(self, obj):
        # obj is the Cart SQLAlchemy model instance
        if not obj or not hasattr(obj, 'items') or not obj.items:
            return 0.0
        
        total = 0.0
        for item in obj.items:
            if hasattr(item, 'price_at_add') and hasattr(item, 'quantity'):
                total += item.price_at_add * item.quantity
        return round(total, 2)

# --- Schemas for API Input (Loading/Validation) ---

class CartItemAddSchema(Schema):
    """
    Schema for validating data when a user adds an item to the cart.
    """
    product_id = fields.Int(required=True, error_messages={"required": "Product ID is required."})
    quantity = fields.Int(required=True, validate=validate.Range(min=1, error="Quantity must be at least 1."), error_messages={"required": "Quantity is required."})
    # You might add fields for product variations here if applicable (e.g., color, size)

class CartItemUpdateSchema(Schema):
    """
    Schema for validating data when a user updates the quantity of an item in the cart.
    """
    quantity = fields.Int(required=True, validate=validate.Range(min=1, error="Quantity must be at least 1. To remove an item, use the delete endpoint."), error_messages={"required": "Quantity is required."})