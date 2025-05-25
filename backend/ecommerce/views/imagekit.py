import traceback
from pyramid.view import view_config
from imagekitio import ImageKit
from pyramid.response import Response

imagekit = ImageKit(
    public_key="public_/G/t0frWoOsGqqQ4fpDh0o8KfiY=",
    private_key="private_y3gZH/qYkAhacOraQV1IsY5N9yc=",
    url_endpoint="https://ik.imagekit.io/wc6bpahhv/"
)

@view_config(route_name='imagekit_auth', renderer='json', request_method='GET')
def imagekit_auth(request):
    try:
        return imagekit.get_authentication_parameters()
    except Exception as e:
        import traceback
        traceback.print_exc()
        return Response(
            json_body={'error': 'Internal Server Error'},
            status=500,
            content_type='application/json'
        )

