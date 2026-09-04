import os
import sys
import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skill_swap.settings")
import django
django.setup()

from api.views import AdminCollectionView


class AdminWorkflowsTests(unittest.TestCase):
    def request(self, data=None, role="admin", user_id="admin-1"):
        req = SimpleNamespace(
            data=data or {},
            user={"id": user_id, "role": role},
            query_params={},
            auth={"jti": "mock-jti"}
        )
        return req

    @patch("api.views.mongo_db")
    def test_admin_collection_get_filters(self, mongo):
        mongo.return_value.__getitem__.return_value.find.return_value.sort.return_value.limit.return_value = [{"id": "q1", "skill_id": "python"}]
        req = self.request()
        req.query_params = {"skill_id": "python", "active": "true"}
        response = AdminCollectionView().get(req, "questions")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data["items"]), 1)

    @patch("api.views.append_audit")
    @patch("api.views.mongo_db")
    def test_admin_create_question_validation_and_success(self, mongo, audit):
        view = AdminCollectionView()
        
        # Missing skill_id or prompt too short
        bad_req = self.request({"skill_id": "", "prompt": "Short"})
        self.assertEqual(view.post(bad_req, "questions").status_code, 400)

        # Missing options
        bad_options = self.request({"skill_id": "python", "prompt": "What is Python list comprehension?", "options": ["Only one"]})
        self.assertEqual(view.post(bad_options, "questions").status_code, 400)

        # Valid question creation
        valid_req = self.request({
            "skill_id": "python",
            "prompt": "What is the time complexity of dict lookup in Python?",
            "options": ["O(1)", "O(n)", "O(log n)", "O(n^2)"],
            "correct_option": 0,
            "difficulty": "intermediate",
            "active": True
        })
        response = view.post(valid_req, "questions")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["correct_option"], "O(1)")
        self.assertEqual(response.data["skill_id"], "python")
        audit.assert_called_once()
        self.assertEqual(audit.call_args[0][1], "admin_question_created")

    @patch("api.views.append_audit")
    @patch("api.views.mongo_db")
    def test_admin_create_skill_validation_and_success(self, mongo, audit):
        view = AdminCollectionView()
        
        # Missing name/slug
        self.assertEqual(view.post(self.request({"name": ""}), "skills").status_code, 400)

        # Valid skill
        response = view.post(self.request({"name": "Go Programming", "slug": "golang", "category": "Backend"}), "skills")
        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data["slug"], "golang")
        audit.assert_called_once()

    @patch("api.views.append_audit")
    @patch("api.views.mongo_db")
    def test_admin_patch_report_with_user_suspension(self, mongo, audit):
        view = AdminCollectionView()
        
        # Setup mock report update
        mongo.return_value.__getitem__.return_value.update_one.return_value.matched_count = 1
        mongo.return_value.reports.find_one.return_value = {
            "id": "report-101",
            "target_type": "user",
            "target_id": "user-violator"
        }

        req = self.request({
            "status": "resolved",
            "action_taken": "suspend",
            "resolution_notes": "Violated community standards repeatedly",
            "reason": "Suspended for repeated conduct violations"
        })
        response = view.patch(req, "reports", "report-101")
        self.assertEqual(response.status_code, 200)
        self.assertTrue(response.data["updated"])

        # Check that user status update was invoked
        mongo.return_value.users.update_one.assert_called_with(
            {"id": "user-violator"},
            {"$set": {"status": "suspended", "updated_at": unittest.mock.ANY}}
        )

    @patch("api.views.append_audit")
    @patch("api.views.mongo_db")
    def test_admin_patch_session_dispute_resolution(self, mongo, audit):
        view = AdminCollectionView()
        mongo.return_value.__getitem__.return_value.update_one.return_value.matched_count = 1

        req = self.request({
            "status": "completed",
            "dispute_resolution": "Teacher provided full session material",
            "reason": "Confirmed session recording verified delivery"
        })
        response = view.patch(req, "sessions", "session-202")
        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.data["changes"]["open_dispute"])


if __name__ == "__main__":
    unittest.main()
