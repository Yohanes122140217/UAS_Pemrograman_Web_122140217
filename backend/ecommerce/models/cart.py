# backend/ecommerce/models/cart.py
from sqlalchemy import Column, Integer, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func  # For server-side default timestamps
from .meta import Base


class Cart(Base):
    __tablename__ = 'carts'

    id = Column(Integer, primary_key=True, index=True)
    # Each cart must belong to a user.
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False, index=True)
    
    # Timestamps
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    # Relationship to User: A cart belongs to one user.
    # The User model will have a 'carts' attribute to access their carts.
    user = relationship("User", back_populates="carts")

    # Relationship to CartItems: A cart can have many items.
    # `cascade="all, delete-orphan"` means if a cart is deleted, its items are also deleted.
    items = relationship("CartItem", back_populates="cart", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Cart(id={self.id}, user_id={self.user_id})>"

class CartItem(Base):
    __tablename__ = 'cart_items'

    id = Column(Integer, primary_key=True, index=True)
    # Each cart item belongs to a specific cart.
    cart_id = Column(Integer, ForeignKey('carts.id'), nullable=False, index=True)
    # Each cart item refers to a specific product.
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False, index=True)
    
    quantity = Column(Integer, nullable=False, default=1)
    # It's crucial to store the price at the time of adding to the cart,
    # as product prices in the 'products' table might change later.
    price_at_add = Column(Float, nullable=False) 
    
    added_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationship to Cart: An item belongs to one cart.
    cart = relationship("Cart", back_populates="items")

    # Relationship to Product: An item refers to one product.
    # This allows you to do `cart_item.product` to get product details.
    product = relationship("Product") # No back_populates needed in Product unless you want product.cart_items

    def __repr__(self):
        return f"<CartItem(id={self.id}, cart_id={self.cart_id}, product_id={self.product_id}, quantity={self.quantity})>"