import os
import sys
import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skill_swap.settings")
import django
django.setup()

from api.views import AssessmentStartView, AssessmentSubmitView, CertificateVerifyView


class AssessmentEngineTests(unittest.TestCase):
    def request(self, data=None, user_id="student-1", name="Sarah Connor"):
        return SimpleNamespace(
            data=data or {},
            user={"id": user_id, "name": name, "role": "member"},
            query_params={},
            auth={"jti": "test-jti"}
        )

    @patch("api.views.mongo_db")
    def test_assessment_start_samples_questions(self, mongo):
        mock_db = MagicMock()
        mongo.return_value = mock_db
        mock_questions = [
            {"id": f"q{i}", "prompt": f"Question {i}?", "options": ["A", "B", "C", "D"], "version": 1, "difficulty": "easy"}
            for i in range(15)
        ]
        mock_db.questions.find.return_value = mock_questions

        req = self.request({"skill_id": "python", "question_count": 10})
        res = AssessmentStartView().post(req)
        self.assertEqual(res.status_code, 201)
        self.assertEqual(len(res.data["questions"]), 10)
        self.assertEqual(res.data["pass_mark"], 70)
        self.assertEqual(res.data["duration_minutes"], 35)
        self.assertTrue(mock_db.assessment_attempts.insert_one.called)

    @patch("api.views.mongo_db")
    def test_assessment_submit_passing_score_issues_certificate(self, mongo):
        mock_db = MagicMock()
        mongo.return_value = mock_db

        attempt = {
            "_id": "mock_id",
            "id": "attempt-1",
            "user_id": "student-1",
            "skill_id": "python",
            "question_ids": ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"],
            "pass_mark": 70,
            "status": "in_progress"
        }
        mock_db.assessment_attempts.find_one.return_value = attempt
        mock_db.questions.find.return_value = [
            {"id": f"q{i}", "correct_option": "A", "prompt": f"Q{i}"} for i in range(1, 11)
        ]
        mock_db.skills.find_one.return_value = {"id": "python", "name": "Python"}
        mock_db.users.find_one.return_value = {"id": "student-1", "name": "Sarah Connor"}

        # 8 out of 10 correct = 80% (Passes 70% threshold)
        answers = {f"q{i}": "A" for i in range(1, 9)}
        answers["q9"] = "B"
        answers["q10"] = "C"

        req = self.request({"answers": answers})
        res = AssessmentSubmitView().post(req, "attempt-1")

        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data["passed"])
        self.assertEqual(res.data["score"], 80)
        self.assertEqual(res.data["correct"], 8)
        self.assertEqual(res.data["total"], 10)
        self.assertIn("certificate", res.data)
        self.assertEqual(res.data["certificate"]["skill"], "Python")
        self.assertEqual(res.data["certificate"]["recipient_name"], "Sarah Connor")
        self.assertTrue(res.data["certificate"]["certificate_no"].startswith("SS-VERIF-"))
        self.assertTrue(mock_db.certificates.insert_one.called)
        self.assertTrue(mock_db.user_skills.update_one.called)

    @patch("api.views.mongo_db")
    def test_assessment_submit_failing_score_does_not_issue_certificate(self, mongo):
        mock_db = MagicMock()
        mongo.return_value = mock_db

        attempt = {
            "_id": "mock_id",
            "id": "attempt-2",
            "user_id": "student-1",
            "skill_id": "python",
            "question_ids": ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8", "q9", "q10"],
            "pass_mark": 70,
            "status": "in_progress"
        }
        mock_db.assessment_attempts.find_one.return_value = attempt
        mock_db.questions.find.return_value = [
            {"id": f"q{i}", "correct_option": "A", "prompt": f"Q{i}"} for i in range(1, 11)
        ]

        # 5 out of 10 correct = 50% (Fails 70% threshold)
        answers = {f"q{i}": "A" for i in range(1, 6)}
        answers.update({f"q{i}": "B" for i in range(6, 11)})

        req = self.request({"answers": answers})
        res = AssessmentSubmitView().post(req, "attempt-2")

        self.assertEqual(res.status_code, 200)
        self.assertFalse(res.data["passed"])
        self.assertEqual(res.data["score"], 50)
        self.assertNotIn("certificate", res.data)
        self.assertFalse(mock_db.certificates.insert_one.called)

    @patch("api.views.mongo_db")
    def test_certificate_verify_endpoint(self, mongo):
        mock_db = MagicMock()
        mongo.return_value = mock_db
        mock_db.certificates.find_one.return_value = {
            "certificate_no": "SS-VERIF-2026-12345",
            "skill": "Python",
            "recipient_name": "Sarah Connor",
            "score": 85,
            "type": "teacher_verification",
            "status": "issued",
            "issued_at": "2026-09-04T12:00:00Z"
        }

        req = SimpleNamespace()
        res = CertificateVerifyView().get(req, "token-xyz")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data["valid"])
        self.assertEqual(res.data["skill"], "Python")
        self.assertEqual(res.data["recipient_name"], "Sarah Connor")
        self.assertEqual(res.data["score"], 85)


if __name__ == "__main__":
    unittest.main()
