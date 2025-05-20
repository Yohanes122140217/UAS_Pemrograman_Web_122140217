# backend/app/routers/users.py

from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPBadRequest, HTTPConflict, HTTPCreated
import json

from sqlalchemy.exc import IntegrityError
from backend.app.database import SessionLocal
from backend.app import crud

@view_config(route_name='signup', renderer='json', request_method='POST')
def signup_view(request):
    try:
        data = request.json_body
    except Exception:
        return HTTPBadRequest(json_body={"error": "Invalid JSON"})

    name = data.get('name')
    email = data.get('email')
    password = data.get('password')
    confirm_password = data.get('confirm_password')

    if not all([name, email, password, confirm_password]):
        return HTTPBadRequest(json_body={"error": "Missing required fields."})

    if password != confirm_password:
        return HTTPBadRequest(json_body={"error": "Passwords do not match."})
    
    # Input validation
    # Checks that all required fields exist and that passwords match;
    # returns 400 Bad Request if invalid.

    db = SessionLocal()
    # Creates a new SQLAlchemy DB session for this request.
    # Note : this creates a session, not a connection or a new DB.

    try:
        existing_user = crud.get_user_by_email(db, email)
        if existing_user:
            return HTTPConflict(json_body={"error": "Email already registered."})
        # Checks if the email is already registered.

        # Creates and stores a new user with hashed password.
        user = crud.create_user(db, name, email, password)
        return HTTPCreated(json_body={"message": "User created successfully.", "user_id": user.id})
        # Returns success status with JSON message and user ID.


    except IntegrityError:
        db.rollback()
        return HTTPConflict(json_body={"error": "Email already registered."})

    finally:
        db.close()
    # Ensures the DB session is closed to free resources.
    # This is crucial to avoid memory leaks and connection pool exhaustion.

# Explanation
#     @view_config (decorator)
#     Registers this function as a Pyramid view for the signup route, responding to HTTP POST requests, returning JSON responses.

#     request.json_body
#     Automatically parses the JSON payload sent by client. Raises error if invalid JSON.

#     Input validation
#     Checks that all required fields exist and that passwords match; returns 400 Bad Request if invalid.

#     SessionLocal()
#     Creates a new SQLAlchemy DB session for this request.

#     crud.get_user_by_email()
#     Checks if the email is already registered.

#     crud.create_user()
#     Creates and stores a new user with hashed password.

#     HTTPCreated (HTTP 201)
#     Returns success status with JSON message and user ID.

#     Exception handling
#     Catches integrity errors like duplicate email, rolls back the session, and returns 409 Conflict.

#     finally: db.close()
#     Ensures the DB session is closed to free resources.