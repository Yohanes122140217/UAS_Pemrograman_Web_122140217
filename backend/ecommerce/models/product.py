from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey
# from sqlalchemy.orm import relationship
from .meta import Base

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    name = Column(String(150), nullable=False)
    description = Column(Text, nullable=True)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0, nullable=False)
    # category_id = Column(Integer, ForeignKey('categories.id'), nullable=True)  # assuming you have categories table

    # Relationship example, assuming Category model exists
    # category = relationship("Category", back_populates="products")
