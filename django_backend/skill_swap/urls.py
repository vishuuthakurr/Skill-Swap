from django.urls import include, path
from django.http import JsonResponse


def health(request):
    return JsonResponse({"service": "skill-swap-api", "status": "ok"})


urlpatterns = [
    path("health/", health, name="health_slash"),
    path("health", health, name="health"),
    path("api/v1/", include("api.urls")),
]
