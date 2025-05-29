# backend/ecommerce/models/product.py
from sqlalchemy import Column, Integer, String, Float, Text
from .meta import Base

# backend/ecommerce/models/product.py
class Product(Base):
    __tablename__ = 'products'

    id             = Column(Integer, primary_key=True)
    name           = Column(String(255), nullable=False)
    seller         = Column(String(255), nullable=False)
    description    = Column(Text, nullable=False)
    price          = Column(Float, nullable=False)
    original_price = Column(Float, nullable=True)
    image_url      = Column(String(512), nullable=True)  # Image URL
    rating         = Column(Float, default=0.0)
    sold           = Column(Integer, default=0)
