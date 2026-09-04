import os
import unittest
from unittest.mock import patch

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skill_swap.settings")

from api.domain import is_certificate_eligible, validate_upload
from api.services import signed_cloudinary_delivery_url


class AvatarSecurityTests(unittest.TestCase):
    def test_rejects_unsupported_type_and_oversized_file(self):
        with self.assertRaises(ValueError):
            validate_upload("avatar.svg", "image/svg+xml", 500, {"image/png"}, 5 * 1024 * 1024)
        with self.assertRaises(ValueError):
            validate_upload("avatar.png", "image/png", 6 * 1024 * 1024, {"image/png"}, 5 * 1024 * 1024)

    def test_completed_session_with_two_confirmations_is_certificate_eligible(self):
        self.assertTrue(is_certificate_eligible({"status": "completed", "completion_confirmations": ["a", "b"]}))
        self.assertFalse(is_certificate_eligible({"status": "completed", "completion_confirmations": ["a"], "open_dispute": False}))

    @patch("api.services.settings.CLOUDINARY_API_SECRET", "")
    def test_signed_read_requires_server_configuration(self):
        with self.assertRaises(RuntimeError):
            signed_cloudinary_delivery_url("skill-swap/avatars/member", "image")


if __name__ == "__main__":
    unittest.main()
