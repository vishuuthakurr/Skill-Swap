import os
import sys
import unittest

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skill_swap.settings")
import django
django.setup()

from api.contracts import fail, ok
from api.errors import api_exception_handler


class ApiContractTests(unittest.TestCase):
    def test_success_and_error_envelopes_are_stable(self):
        self.assertEqual(ok({"id": "1"}).data, {"data": {"id": "1"}, "error": None})
        self.assertEqual(fail("Nope", code="not_found").data, {"data": None, "error": {"code": "not_found", "detail": "Nope"}})

    def test_exception_handler_returns_stable_error_shape(self):
        from rest_framework.exceptions import NotAuthenticated
        response = api_exception_handler(NotAuthenticated(), {})
        self.assertEqual(response.data["data"], None)
        self.assertEqual(response.data["error"]["status"], 401)
        self.assertIn("detail", response.data["error"])


if __name__ == "__main__":
    unittest.main()
