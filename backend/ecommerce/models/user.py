# backend/ecommerce/models/user.py
from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship # <--- Add this import
from .meta import Base
import bcrypt

class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True)
    username = Column(String(50), unique=True, nullable=False)
    email = Column(String(100), unique=True, nullable=False)
    password = Column(String(255), nullable=False)
    carts = relationship("Cart", back_populates="user", cascade="all, delete-orphan") 

    @staticmethod
    def hash_password(password: str) -> str:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    def verify_password(self, password: str) -> bool:
        return bcrypt.checkpw(password.encode('utf-8'), self.password.encode('utf-8'))

    def __repr__(self): # Optional: Add a repr for easier debugging
        return f"<User(id={self.id}, username='{self.username}')>"