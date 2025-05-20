# backend/app/database.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session

# Database URL for PostgreSQL
DATABASE_URL = "postgresql+psycopg2://postgre:administrator@localhost/ecommerce_db"

# Creates a connection pool to the database.
# Here, you pass the URL which tells SQLAlchemy to connect to PostgreSQL using the psycopg2 driver.
# Format : dialect+driver://username:password@host:port/database_name
engine = create_engine(DATABASE_URL, echo=True)  # echo=True for debug logs

# Wraps sessionmaker to provide thread-safe sessions (important for web apps with multiple requests concurrently).
SessionLocal = scoped_session(sessionmaker(autocommit=False, autoflush=False, bind=engine))
