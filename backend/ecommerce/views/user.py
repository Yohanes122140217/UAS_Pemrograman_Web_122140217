# from pyramid.view import view_config
# from pyramid.response import Response
# from pyramid.request import Request
# from sqlalchemy.exc import IntegrityError
# import json
# import jwt
# from datetime import datetime, timedelta
# from marshmallow import ValidationError

# from ..models.user import User
# from ..models.meta import DBSession
# from ..schemas.user import UserSignupSchema, UserLoginSchema

# JWT_SECRET = 'Merchant_Secret' # Replace wiith a secure secret key

# @view_config(route_name='signup', renderer='json', request_method='POST')
# def signup_view(request: Request):
#     try:
#         data = request.json_body  # parse JSON POST body
        
#         # Validate data
#         schema = UserSignupSchema()
#         result = schema.load(data)

#         password = result['password']

#         hashed_password = User.hash_password(password)
        
#         # Check if user exists
#         existing_user = DBSession.query(User).filter(
#             (User.username == result['username']) | (User.email == result['email'])
#         ).first()
#         if existing_user:
#             return Response(
#                 json.dumps({'error': 'Username or email already exists'}),
#                 status=400,
#                 content_type='application/json'
#             )

#         # Create user
#         user = User(
#             username=result['username'],
#             email=result['email'],
#             password=hashed_password  # TODO: hash password before saving
#         )

#         DBSession.add(user)
#         DBSession.flush()  # to raise errors early
        
#         return {'message': 'User registered successfully'}
    
#     except IntegrityError as e:
#     # Handle IntegrityError, e.g., if username or email already exists
#         return Response(
#             json.dumps({'error': 'Username or email already exists'}), 
#             status=400, 
#             content_type='application/json'
#         )
    
#     except Exception as e:
#         return Response(
#             body=json.dumps({'error': str(e)}).encode('utf-8'), # convert to bytes for Response body
#             status=400,
#             content_type='application/json',
#         )
    

# def verify_user_credentials(username, password):
#     """
#     Verify user credentials.
#     """
#     user = DBSession.query(User).filter_by(username=username).first()
#     if user and user.verify_password(password):
#         return True
#     else :
#         return False
    

# # Middleware for JWS authentication

# def create_jwt_token(user_id):
#     expiration = datetime.utcnow() + timedelta(hours=1)
#     token = jwt.encode({
#         'user_id': user_id,
#         'exp': expiration
#     }, JWT_SECRET, algorithm='HS256')
#     if isinstance(token,bytes):
#         token = token.decode('utf-8')
#     return token


# @view_config(route_name='login', renderer='json', request_method='POST')
# def login_view(request: Request):
#     try:
#         data = request.json_body  # parse JSON POST body

#         # Validate data
#         schema = UserLoginSchema()
#         result = schema.load(data)

#         email = result.get('email')
#         password = result.get('password')

#         # Check if user exists
#         user = DBSession.query(User).filter_by(email=email).first()

#         if user and user.verify_password(password):
#             token = create_jwt_token(user.id)  # Generate JWT token upon successful login
#             return {
#                 "token": token  # Return the token
#             }
#         else:
#             return Response(
#                 json.dumps({'error': 'Invalid email or password'}),
#                 status=401,
#                 content_type='application/json; charset=UTF-8',
#             )

#     except ValidationError as err:
#         # Handle schema validation errors
#         return Response(
#             json.dumps({'error': err.messages}),
#             status=400,
#             content_type='application/json; charset=UTF-8',
#         )
#     except Exception as e:
#         # Handle any other exceptions
#         return Response(
#             body=json.dumps({'error': str(e)}).encode('utf-8'),
#             status=400,
#             content_type='application/json; charset=UTF-8',
#         )

# views/user.py
import json
import jwt
from datetime import datetime, timedelta

from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound
from sqlalchemy.exc import IntegrityError
from marshmallow import ValidationError

from ..models.meta import DBSession
from ..models.user import User
from ..schemas.user import UserSignupSchema, UserLoginSchema
from ..security import is_authenticated, JWT_SECRET

def create_jwt_token(user_id):
    exp = datetime.utcnow() + timedelta(hours=1)
    payload = {'user_id': user_id, 'exp': exp}
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return token if isinstance(token, str) else token.decode('utf-8')

@view_config(route_name='signup', renderer='json', request_method='POST')
def signup_view(request):
    # block repeated signup if already authenticated
    if is_authenticated(request):
        return HTTPFound(location=request.route_url('home'))

    try:
        data = request.json_body
        attrs = UserSignupSchema().load(data)
        if DBSession.query(User).filter(
            (User.username == attrs['username']) |
            (User.email == attrs['email'])
        ).first():
            raise IntegrityError(None, None, None)
        user = User(
            username=attrs['username'],
            email=attrs['email'],
            password=User.hash_password(attrs['password'])
        )
        DBSession.add(user)
        DBSession.flush()
        return {'message': 'User registered'}
    except IntegrityError:
        return Response(
            json.dumps({'error': 'Username or email already taken'}),
            status=400,
            content_type='application/json'
        )
    except ValidationError as ve:
        return Response(
            json.dumps({'error': ve.messages}),
            status=400,
            content_type='application/json'
        )

@view_config(route_name='login', renderer='json', request_method='POST')
def login_view(request):
    # block repeated login if already authenticated
    if is_authenticated(request):
        return HTTPFound(location=request.route_url('home'))

    try:
        data = request.json_body
        creds = UserLoginSchema().load(data)
        user = DBSession.query(User).filter_by(email=creds['email']).first()
        if user and user.verify_password(creds['password']):
            token = create_jwt_token(user.id)
            return {'token': token}
        return Response(
            json.dumps({'error': 'Invalid email or password'}),
            status=401,
            content_type='application/json'
        )
    except ValidationError as ve:
        return Response(
            json.dumps({'error': ve.messages}),
            status=400,
            content_type='application/json'
        )
