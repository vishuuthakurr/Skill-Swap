from datetime import datetime, timezone
import jwt
from django.conf import settings
from rest_framework.authentication import BaseAuthentication, get_authorization_header
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.permissions import BasePermission


class SkillSwapUser(dict):
    @property
    def is_authenticated(self):
        return True

    @property
    def id(self):
        return self.get("id")


class SkillSwapJWTAuthentication(BaseAuthentication):
    """Validate short-lived access tokens issued by the Skill-Swap auth service."""

    def authenticate(self, request):
        raw = get_authorization_header(request).decode("utf-8")
        if not raw.startswith("Bearer "):
            return None
        token = raw.removeprefix("Bearer ").strip()
        try:
            payload = jwt.decode(token, settings.JWT_SECRET, algorithms=["HS256"], options={"require": ["sub", "exp", "iat"]})
        except jwt.PyJWTError as exc:
            raise AuthenticationFailed("Invalid or expired access token") from exc
        if payload.get("token_type", "access") != "access":
            raise AuthenticationFailed("Access token required")
        if payload.get("jti"):
            from .services import mongo_db
            if mongo_db().revoked_tokens.find_one({"jti": payload["jti"]}, {"_id": 1}):
                raise AuthenticationFailed("Access token has been revoked")
        user = SkillSwapUser({"id": payload["sub"], "role": payload.get("role", "user"), "status": payload.get("status", "active")})
        if user["status"] != "active":
            raise AuthenticationFailed("Account is not active")
        return user, payload


class IsAdmin(BasePermission):
    message = "Administrator permission is required."

    def has_permission(self, request, view):
        return bool(request.user and request.user.get("role") == "admin")


class IsSessionParticipant(BasePermission):
    message = "You must be a participant in this session."

    def has_object_permission(self, request, view, obj):
        return str(request.user.get("id")) in {str(obj.get("participant_a_id")), str(obj.get("participant_b_id"))}
