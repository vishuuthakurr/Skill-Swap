import os
import unittest
from unittest.mock import patch

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skill_swap.settings")

from api.services import create_access_token, issue_zegocloud_credentials, send_otp_email


class ProviderAdapterTests(unittest.TestCase):
    @patch("api.services.settings.SMTP_USERNAME", "member@example.com")
    @patch("api.services.settings.SMTP_PASSWORD", "app-password")
    @patch("api.services.smtplib.SMTP", side_effect=OSError("smtp unavailable"))
    def test_smtp_transport_failure_is_safe(self, _smtp):
        with self.assertRaisesRegex(RuntimeError, "Gmail SMTP delivery is temporarily unavailable"):
            send_otp_email("member@example.com", "123456")

    @patch("api.services.settings.SMTP_USERNAME", "")
    @patch("api.services.settings.SMTP_PASSWORD", "")
    def test_smtp_fails_closed_without_credentials(self):
        with self.assertRaises(RuntimeError):
            send_otp_email("member@example.com", "123456")

    @patch("api.services.settings.ZEGO_APP_ID", "123456789")
    @patch("api.services.settings.ZEGO_SERVER_SECRET", "0123456789abcdef0123456789abcdef")
    def test_zego_rejects_non_participant(self):
        with self.assertRaises(PermissionError):
            issue_zegocloud_credentials({"room_id": "room", "participant_a_id": "a", "participant_b_id": "b"}, "c")

    @patch("api.services.settings.ZEGO_APP_ID", "123456789")
    @patch("api.services.settings.ZEGO_SERVER_SECRET", "0123456789abcdef0123456789abcdef")
    def test_zego_returns_short_lived_room_boundary_for_participant(self):
        result = issue_zegocloud_credentials({"room_id": "room", "participant_ids": ["a", "b"]}, "a")
        self.assertEqual(result["expires_in"], "900")
        self.assertEqual(result["room_id"], "room")

    @patch("api.services.settings.JWT_ACCESS_MINUTES", 15)
    @patch("api.services.settings.JWT_SECRET", "dev-secret")
    def test_new_access_token_contains_unique_jti(self):
        import jwt
        first = jwt.decode(create_access_token({"id": "a"}), "dev-secret", algorithms=["HS256"])
        second = jwt.decode(create_access_token({"id": "a"}), "dev-secret", algorithms=["HS256"])
        self.assertTrue(first["jti"])
        self.assertNotEqual(first["jti"], second["jti"])


if __name__ == "__main__":
    unittest.main()
