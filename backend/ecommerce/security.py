# from pyramid.response import Response
# from pyramid.httpexceptions import HTTPFound
# import jwt

# def cors_tween_factory(handler, registry):
#     def cors_tween(request):
#         if request.method == 'OPTIONS':
#             response = Response()
#             response.status = 200
#         else:
#             response = handler(request)
#         response.headers.update({
#             'Access-Control-Allow-Origin': '*',
#             'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
#             'Access-Control-Allow-Headers': 'Content-Type,Authorization',
#         })
#         # Handle OPTIONS preflight requests
#         return response
#     return cors_tween


# JWT_SECRET = "Merchant_Secret"

# # Middleware to check if the user is authenticated
# def is_authenticated(request):
#     """Check if the user is authenticated by verifying the JWT token"""
#     auth_token = request.headers.get('Authorization')
#     # Check if the Authorization header is present
    
#     if auth_token:
#         try:
#             token = auth_token.split(' ')[1]  # 'Bearer <token>'
#             decoded = jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
#             return True  # User is authenticated
#         except jwt.ExpiredSignatureError:
#             return False  # Token has expired
#         except jwt.InvalidTokenError:
#             return False  # Invalid token
#     return False  # No token found

# def prevent_logged_in_user(handler, registry):
#     """Middleware to prevent logged-in users from accessing signup/login pages"""
#     def wrapper(request):
#         if is_authenticated(request) and request.path in ['/login','/signup']:
#             # If the user is authenticated, redirect them to the home page or dashboard
#             return HTTPFound(location='/')  # Redirect to home or any other page
#         return handler(request)
#     return wrapper

# security.py
from pyramid.response import Response
from pyramid.httpexceptions import HTTPFound
import jwt

JWT_SECRET = "Merchant_Secret"

def cors_tween_factory(handler, registry):
    def cors_tween(request):
        if request.method == 'OPTIONS':
            response = Response(status=200)
        else:
            response = handler(request)
        response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        })
        return response
    return cors_tween

def is_authenticated(request):
    """Return True if the Authorization: Bearer <token> header is valid."""
    auth = request.headers.get('Authorization')
    if not auth:
        return False
    try:
        scheme, token = auth.split(' ', 1)
        if scheme.lower() != 'bearer':
            return False
        jwt.decode(token, JWT_SECRET, algorithms=['HS256'])
        return True
    except Exception:
        return False

def prevent_logged_in_user_tween_factory(handler, registry):
    """
    Pyramid tween that intercepts requests to 'login' or 'signup'
    and redirects to 'home' if already authenticated.
    """
    def tween(request):
        # get the matched route object (or None)
        route = getattr(request, 'matched_route', None)
        # extract its name
        route_name = getattr(route, 'name', None)

        # if this is the login or signup route and user is already logged in…
        if route_name in ('login', 'signup') and is_authenticated(request):
            return HTTPFound(location=request.route_url('home'))

        return handler(request)
    return tween
