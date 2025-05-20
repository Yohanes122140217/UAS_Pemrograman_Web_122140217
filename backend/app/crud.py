# backend/app/crud.py

from sqlalchemy.orm import Session
from backend.app import models

# Runs a query filtering the users table for a user matching the given email.
# Returns the first user or None.
def get_user_by_email(db: Session, email: str): 
    return db.query(models.User).filter(models.User.email == email).first()

# (db: Session)
# Function expects an active SQLAlchemy session to interact with the DB.

def create_user(db: Session, name: str, email: str, password: str):
    user = models.User(name=name, email=email)
    user.set_password(password)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user

# create_user()
    # Creates an instance of User with provided data.
    # Calls set_password() to hash the password securely.
    # db.add(user) schedules the user to be inserted in DB.
    # db.commit() commits the transaction, actually saving the user in the DB.
    # db.refresh(user) reloads the user instance from DB to get the generated primary key (id).
    # Returns the new user instance.