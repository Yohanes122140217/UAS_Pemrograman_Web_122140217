# views/user.py
import json
import jwt
from datetime import datetime, timedelta

from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound, HTTPBadRequest, HTTPUnauthorized
from sqlalchemy.exc import IntegrityError
from marshmallow import ValidationError

from ..models.meta import DBSession
from ..models.user import User
from ..schemas.user import UserSignupSchema, UserLoginSchema
from ..security import is_authenticated, JWT_SECRET


def create_jwt_token(user_id):
    exp = datetime.now() + timedelta(hours=1)
    payload = {'user_id': user_id, 'exp': exp}
    token = jwt.encode(payload, JWT_SECRET, algorithm='HS256')
    return token if isinstance(token, str) else token.decode('utf-8')


@view_config(route_name='signup', renderer='json', request_method='POST')
def signup_view(request):
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
            body=json.dumps({'error': 'User already exists'}),
            status=400,
            content_type='application/json',
            charset='utf-8'
        )
    except ValidationError as ve:
        return Response(
            body=json.dumps({'error': ve.messages}),
            status=400,
            content_type='application/json',
            charset='utf-8'
        )


@view_config(route_name='login', renderer='json', request_method='POST')
def login_view(request):
    if is_authenticated(request):
        return HTTPFound(location=request.route_url('home'))

    try:
        data = request.json_body
        creds = UserLoginSchema().load(data)
        user = DBSession.query(User).filter_by(email=creds['email']).first()
        if user and user.verify_password(creds['password']):
            token = create_jwt_token(user.id)
            return {
                'token': token,
                'username' : user.username
                }

        return Response(
            body=json.dumps({'error': 'Invalid email or password'}),
            status=401,
            content_type='application/json',
            charset='utf-8'
        )
    except ValidationError as ve:
        return Response(
            body=json.dumps({'error': ve.messages}),
            status=400,
            content_type='application/json',
            charset='utf-8'
        )
    # Optional cleaner version using HTTP exceptions:
    # except ValidationError as ve:
    #     raise HTTPBadRequest(json_body={"error": ve.messages})
    # return HTTPUnauthorized(json_body={"error": "Invalid email or password"})
