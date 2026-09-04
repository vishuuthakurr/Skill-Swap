import os
import sys
import unittest
from types import SimpleNamespace
from unittest.mock import MagicMock, patch

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skill_swap.settings")
import django
django.setup()

from api.views import (AdminCollectionView, AssessmentStartView, BlockView, CertificateIssueView, MatchRequestActionView, MatchRequestView, ReportView, RegisterView, ResendOtpView, ResetPasswordView, SessionActionView, SessionView, UserSkillsView, VerifyOtpView)


class MutationValidationTests(unittest.TestCase):
    def request(self, data=None, user_id="member-a"):
        return SimpleNamespace(data=data or {}, user={"id": user_id, "role": "user"}, query_params={})

    def test_public_auth_validation_rejects_weak_registration_and_reset(self):
        self.assertEqual(RegisterView().post(self.request({"name": "", "email": "bad", "password": "short"})).status_code, 400)
        self.assertEqual(ResetPasswordView().post(self.request({"token": "", "password": "short"})).status_code, 400)

    @patch("api.views.verify_otp", return_value=False)
    def test_otp_validation_rejects_invalid_code(self, verify):
        response = VerifyOtpView().post(self.request({"email": "member@example.com", "code": "bad"}))
        self.assertEqual(response.status_code, 400)
        verify.assert_called_once()

    @patch("api.views.allow_rate_limited_action", return_value=False)
    def test_otp_resend_rate_limit_is_privacy_safe(self, limited):
        response = ResendOtpView().post(self.request({"email": "member@example.com"}))
        self.assertEqual(response.status_code, 429)

    def test_member_relationship_validation_rejects_invalid_inputs(self):
        self.assertEqual(UserSkillsView().post(self.request({"skill_id": "", "direction": "teach"})).status_code, 400)
        self.assertEqual(MatchRequestView().post(self.request({"recipient_id": "member-a"})).status_code, 400)
        self.assertEqual(BlockView().post(self.request({"blocked_id": "member-a"})).status_code, 400)
        self.assertEqual(ReportView().post(self.request({"target_type": "user", "target_id": "b", "reason": "short"})).status_code, 400)

    @patch("api.views.mongo_db")
    def test_certificate_validation_rejects_ineligible_session(self, mongo):
        mongo.return_value.sessions.find_one.return_value = None
        response = CertificateIssueView().post(self.request({"skill": "Python"}), "session-1")
        self.assertEqual(response.status_code, 409)

    @patch("api.views.mongo_db")
    def test_session_assessment_and_admin_validation_reject_invalid_inputs(self, mongo):
        mongo.return_value.sessions.find_one.return_value = None
        self.assertEqual(SessionView().post(self.request({"participant_ids": ["member-a"]})).status_code, 400)
        self.assertEqual(AssessmentStartView().post(self.request({"skill_id": ""})).status_code, 400)
        mongo.return_value.sessions.find_one.return_value = {"id": "session-1", "participant_ids": ["member-a", "member-b"], "status": "scheduled"}
        self.assertEqual(SessionActionView().post(self.request({"reason": "short"}, "member-a"), "session-1", "dispute").status_code, 400)
        self.assertEqual(SessionActionView().post(self.request({}, "member-a"), "session-1", "unknown").status_code, 400)
        self.assertEqual(SessionActionView().post(self.request({"consent": True}, "member-a"), "session-1", "consent").status_code, 200)
        admin_request = self.request({"status": "issued", "reason": "valid moderation reason"}, "admin-a")
        admin_request.user = {"id": "admin-a", "role": "admin"}
        self.assertEqual(AdminCollectionView().get(admin_request, "unknown").status_code, 404)
        mongo.return_value.__getitem__.return_value.update_one.return_value.matched_count = 0
        self.assertEqual(AdminCollectionView().patch(admin_request, "certificates", "c-1").status_code, 404)
        self.assertEqual(AdminCollectionView().patch(self.request({"private": True, "reason": "valid moderation reason"}, "admin-a"), "certificates", "c-1").status_code, 400)
        self.assertEqual(MatchRequestActionView().patch(self.request({"status": "unknown"}), "request-1").status_code, 400)


if __name__ == "__main__":
    unittest.main()
