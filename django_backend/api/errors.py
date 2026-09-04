from rest_framework.views import exception_handler


def api_exception_handler(exc, context):
    response = exception_handler(exc, context)
    if response is None:
        return response
    detail = response.data.get("detail") if isinstance(response.data, dict) else None
    code = response.data.get("code", "request_error") if isinstance(response.data, dict) else "request_error"
    response.data = {
        "data": None,
        "error": {
            "code": code,
            "status": response.status_code,
            "detail": detail or "The request could not be completed.",
        },
    }
    return response
