import os
import sys
import unittest
from unittest.mock import patch

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skill_swap.settings")
import django
django.setup()

import jwt
from django.test import RequestFactory
from rest_framework.exceptions import AuthenticationFailed
from rest_framework.request import Request
from api.authentication import SkillSwapJWTAuthentication
from api.services import create_access_token


class AuthenticationSecurityTests(unittest.TestCase):
    def _request(self, token):
        request = RequestFactory().get("/api/v1/me", HTTP_AUTHORIZATION=f"Bearer {token}")
        return Request(request)

    @patch("api.services.mongo_db")
    def test_revoked_jti_is_rejected(self, mongo):
        mongo.return_value.revoked_tokens.find_one.return_value = {"_id": "revoked"}
        with patch("api.authentication.settings.JWT_SECRET", "dev-secret"):
            token = create_access_token({"id": "member-a", "role": "user", "status": "active"})
            import jwt
            payload = jwt.decode(token, "dev-secret", algorithms=["HS256"])
            mongo.return_value.revoked_tokens.find_one.assert_not_called()
            mongo.return_value.revoked_tokens.find_one.return_value = {"jti": payload["jti"]}
            with self.assertRaises(AuthenticationFailed):
                SkillSwapJWTAuthentication().authenticate(self._request(token))

    def test_inactive_account_payload_is_rejected(self):
        token = jwt.encode({"sub": "member-a", "iat": 1, "exp": 4102444800, "status": "suspended"}, "dev-secret", algorithm="HS256")
        with patch("api.authentication.settings.JWT_SECRET", "dev-secret"):
            with self.assertRaises(AuthenticationFailed):
                SkillSwapJWTAuthentication().authenticate(self._request(token))


if __name__ == "__main__":
    unittest.main()
