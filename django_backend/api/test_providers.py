import os
import smtplib
import unittest
from unittest.mock import patch

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skill_swap.settings")

from api.services import (
    create_access_token,
    issue_zegocloud_credentials,
    send_otp_email,
    signed_cloudinary_delivery_url,
    upload_cloudinary_asset,
)


class RateLimitPersistenceTests(unittest.TestCase):
    """Rate-limit records survive a Mongo round-trip where BSON datetimes come back naive."""

    def _fresh_db(self):
        import mongomock
        return mongomock.MongoClient().skill_swap

    def test_rate_limit_survives_naive_datetime_roundtrip(self):
        import hashlib
        from datetime import datetime, timedelta, timezone
        from unittest.mock import patch
        from api.domain import allow_rate_limited_action

        db = self._fresh_db()
        # allow_rate_limited_action hashes the key before lookup; simulate what real
        # MongoDB returns: a stored record read back as naive UTC.
        digest = hashlib.sha256("abc".encode("utf-8")).hexdigest()
        past = datetime.now(timezone.utc).replace(tzinfo=None) - timedelta(seconds=10)
        db.rate_limits.insert_one({"key": digest, "count": 5, "window_ends_at": past})
        with patch("api.domain.mongo_db", return_value=db):
            # Expired window -> must reset, not crash comparing naive vs aware.
            self.assertTrue(allow_rate_limited_action("abc", limit=5, window_seconds=60))
        record = db.rate_limits.find_one({"key": digest})
        self.assertEqual(record["count"], 1)

    def test_rate_limit_blocks_when_limit_reached_across_reads(self):
        import hashlib
        from datetime import datetime, timedelta, timezone
        from unittest.mock import patch
        from api.domain import allow_rate_limited_action

        db = self._fresh_db()
        digest = hashlib.sha256("xyz".encode("utf-8")).hexdigest()
        future = datetime.now(timezone.utc).replace(tzinfo=None) + timedelta(seconds=60)
        db.rate_limits.insert_one({"key": digest, "count": 5, "window_ends_at": future})
        with patch("api.domain.mongo_db", return_value=db):
            self.assertFalse(allow_rate_limited_action("xyz", limit=5, window_seconds=60))


class ProviderAdapterTests(unittest.TestCase):
    @patch("api.services.settings.SMTP_USERNAME", "member@example.com")
    @patch("api.services.settings.SMTP_PASSWORD", "app-password")
    @patch("api.services.smtplib.SMTP", side_effect=OSError("smtp unavailable"))
    def test_smtp_transport_failure_is_safe(self, _smtp):
        with self.assertRaisesRegex(RuntimeError, "Gmail SMTP delivery failed unexpectedly"):
            send_otp_email("member@example.com", "123456")

    @patch("api.services.settings.SMTP_USERNAME", "")
    @patch("api.services.settings.SMTP_PASSWORD", "")
    def test_smtp_fails_closed_without_credentials(self):
        with self.assertRaisesRegex(RuntimeError, "SMTP credentials are not configured"):
            send_otp_email("member@example.com", "123456")

    @patch("api.services.settings.SMTP_USERNAME", "demo@gmail.com")
    @patch("api.services.settings.SMTP_PASSWORD", "demo-password")
    def test_smtp_fails_closed_with_placeholder_credentials(self):
        with self.assertRaisesRegex(RuntimeError, "looks like a placeholder"):
            send_otp_email("member@example.com", "123456")

    @patch("api.services.settings.SMTP_USERNAME", "real@gmail.com")
    @patch("api.services.settings.SMTP_PASSWORD", "wrong-app-password")
    @patch(
        "api.services.smtplib.SMTP",
        side_effect=smtplib.SMTPAuthenticationError(
            535, b"5.7.8 Username and Password not accepted. BadCredentials"
        ),
    )
    def test_smtp_bad_credentials_get_actionable_message(self, _smtp):
        with self.assertRaisesRegex(RuntimeError, "535 BadCredentials.*App Password"):
            send_otp_email("member@example.com", "123456")

    @patch("api.services.settings.ZEGO_APP_ID", "1823456789")
    @patch("api.services.settings.ZEGO_SERVER_SECRET", "f3a9c2e1b8d74605a2c9e1f3b8d74605")
    def test_zego_rejects_non_participant(self):
        with self.assertRaises(PermissionError):
            issue_zegocloud_credentials({"room_id": "room", "participant_a_id": "a", "participant_b_id": "b"}, "c")

    @patch("api.services.settings.ZEGO_APP_ID", "1823456789")
    @patch("api.services.settings.ZEGO_SERVER_SECRET", "f3a9c2e1b8d74605a2c9e1f3b8d74605")
    def test_zego_returns_short_lived_room_boundary_for_participant(self):
        result = issue_zegocloud_credentials({"room_id": "room", "participant_ids": ["a", "b"]}, "a")
        self.assertEqual(result["expires_in"], "900")
        self.assertEqual(result["room_id"], "room")

    @patch("api.services.settings.ZEGO_APP_ID", "1234567890")
    @patch("api.services.settings.ZEGO_SERVER_SECRET", "0123456789abcdef0123456789abcdef")
    def test_zego_fails_closed_with_placeholder_credentials(self):
        with self.assertRaisesRegex(RuntimeError, "template placeholders"):
            issue_zegocloud_credentials({"room_id": "room", "participant_ids": ["a", "b"]}, "a")

    @patch("api.services.settings.ZEGO_APP_ID", "")
    @patch("api.services.settings.ZEGO_SERVER_SECRET", "")
    def test_zego_fails_closed_without_credentials(self):
        with self.assertRaisesRegex(RuntimeError, "not configured"):
            issue_zegocloud_credentials({"room_id": "room", "participant_ids": ["a", "b"]}, "a")

    @patch("api.services.settings.CLOUDINARY_CLOUD_NAME", "demo-cloud")
    @patch("api.services.settings.CLOUDINARY_API_KEY", "123456789012345")
    @patch("api.services.settings.CLOUDINARY_API_SECRET", "sample-secret")
    def test_cloudinary_fails_closed_with_placeholder_credentials(self):
        with self.assertRaisesRegex(RuntimeError, "look like placeholders"):
            upload_cloudinary_asset(b"x", "public-id")

    @patch("api.services.settings.CLOUDINARY_CLOUD_NAME", "")
    @patch("api.services.settings.CLOUDINARY_API_KEY", "")
    @patch("api.services.settings.CLOUDINARY_API_SECRET", "")
    def test_cloudinary_fails_closed_without_credentials(self):
        with self.assertRaisesRegex(RuntimeError, "not configured"):
            signed_cloudinary_delivery_url("public-id")

    @patch("api.services.settings.CLOUDINARY_CLOUD_NAME", "real-cloud")
    @patch("api.services.settings.CLOUDINARY_API_KEY", "987654321098765")
    @patch("api.services.settings.CLOUDINARY_API_SECRET", "aVeryRealSecret123")
    def test_cloudinary_upload_401_gets_actionable_message(self):
        import sys
        import cloudinary.uploader

        self.assertIn("cloudinary", sys.modules)
        with patch.object(
            cloudinary.uploader,
            "upload",
            side_effect=Exception("401 Unauthorized: Invalid api_key"),
        ):
            with self.assertRaisesRegex(RuntimeError, "401.*Verify CLOUDINARY_API_KEY"):
                upload_cloudinary_asset(b"x", "public-id")

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
