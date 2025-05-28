

# imagekit.py in your Pyramid backend
from pyramid.view import view_config
from imagekitio import ImageKit

imagekit = ImageKit(
    public_key="public_/G/t0frWoOsGqqQ4fpDh0o8KfiY=",
    private_key="private_y3gZH/qYkAhacOraQV1IsY5N9yc=",
    url_endpoint="https://ik.imagekit.io/wc6bpahhv/"
)

@view_config(route_name='imagekit_auth', renderer='json', request_method='GET')
def imagekit_auth(request):
    return imagekit.get_authentication_parameters()
