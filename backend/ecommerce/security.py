def cors_tween_factory(handler, registry):
    def cors_tween(request):
        response = handler(request)
        response.headers.update({
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type,Authorization',
        })
        # Handle OPTIONS preflight requests
        if request.method == 'OPTIONS':
            response.status_code = 200
            return response
        return response
    return cors_tween
