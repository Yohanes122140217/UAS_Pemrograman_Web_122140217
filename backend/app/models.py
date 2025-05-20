# backend/app/models.py

from sqlalchemy import Column, Integer, String
from backend.app.database import engine, SessionLocal
from sqlalchemy.ext.declarative import declarative_base
from passlib.hash import bcrypt

# Base class for all ORM models.
# It sets up SQLAlchemy’s system to map Python classes to DB tables.
Base = declarative_base()

# Defines a Python class that maps to a database table users.
class User(Base):
    # Name of the table in PostgreSQL.
    __tablename__ = "users"

    # Primary key column of type integer.
    # index=True creates an index to speed up queries filtering by id.
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)


    # Takes a plain password string, hashes it securely with bcrypt (from Passlib)
    # and stores the hashed password in password_hash column.
    def set_password(self, password: str):
        self.password_hash = bcrypt.hash(password)

    # Compares a given password to the stored hash and returns True if it matches.
    # Useful during login.
    def verify_password(self, password: str) -> bool:
        return bcrypt.verify(password, self.password_hash)

# Calls Base.metadata.create_all() which tells SQLAlchemy to create tables in the database if they don’t exist yet, based on your models.
def init_db():
    Base.metadata.create_all(bind=engine)
