import os
import sys
import unittest
from types import SimpleNamespace
from unittest.mock import patch

sys.path.insert(0, os.path.dirname(os.path.dirname(__file__)))
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "skill_swap.settings")
import django
django.setup()

from api.views import AuditEventView, ProtectedMediaView


class ViewsSecurityTests(unittest.TestCase):
    def _request(self, data=None, user_id="member-a"):
        return SimpleNamespace(data=data or {}, user={"id": user_id, "role": "user"})

    @patch("api.views.append_audit", return_value="audit-1")
    def test_all_socket_actions_are_persisted_through_immutable_service(self, append):
        actions = ["conversation_joined", "message_created", "message_read", "socket_disconnected"]
        for action in actions:
            response = AuditEventView().post(self._request({"action": action, "conversation_id": "c-1"}))
            self.assertEqual(response.status_code, 201)
        self.assertEqual([call.args[1] for call in append.call_args_list], actions)
        for call in append.call_args_list:
            self.assertGreaterEqual(len(call.args[4]), 8)
            self.assertEqual(call.args[5]["source"], "socket.io")

    @patch("api.views.append_audit", return_value="audit-1")
    def test_audit_rejects_invalid_payload(self, append):
        response = AuditEventView().post(self._request({"action": ""}))
        self.assertEqual(response.status_code, 400)
        append.assert_not_called()

    @patch("api.domain.mongo_db")
    def test_audit_endpoint_persists_immutable_records(self, mongo):
        inserted = []
        mongo.return_value.audit_logs.insert_one.side_effect = lambda payload: inserted.append(payload)
        with patch("api.views.append_audit", wraps=__import__("api.domain", fromlist=["append_audit"]).append_audit):
            for action in ["conversation_joined", "message_created", "message_read", "socket_disconnected"]:
                response = AuditEventView().post(self._request({"action": action, "conversation_id": "c-1"}))
                self.assertEqual(response.status_code, 201)
        self.assertEqual([row["action"] for row in inserted], ["conversation_joined", "message_created", "message_read", "socket_disconnected"])
        self.assertTrue(all(row["immutable"] is True and row["actor_id"] == "member-a" and row["target_id"] == "c-1" and row["metadata"]["source"] == "socket.io" for row in inserted))

    def _media_request(self, user_id="member-a"):
        return SimpleNamespace(user={"id": user_id, "role": "user"})

    @patch("api.views.signed_cloudinary_delivery_url", return_value="https://signed.example/media")
    @patch("api.views.mongo_db")
    def test_protected_recording_returns_signed_url_for_participant(self, mongo, signed):
        mongo.return_value.__getitem__.return_value.find_one.return_value = {"public_id": "recording/1", "resource_type": "video", "participant_a_id": "member-a"}
        response = ProtectedMediaView().get(self._media_request(), "recordings", "r-1")
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data["url"], "https://signed.example/media")
        signed.assert_called_once_with("recording/1", "video", 300)

    @patch("api.views.mongo_db")
    def test_protected_certificate_denies_other_user(self, mongo):
        mongo.return_value.__getitem__.return_value.find_one.return_value = {"public_id": "certificate/1", "recipient_id": "member-b"}
        response = ProtectedMediaView().get(self._media_request("member-a"), "certificates", "cert-1")
        self.assertEqual(response.status_code, 404)

    @patch("api.views.mongo_db")
    def test_protected_media_returns_not_ready_for_missing_public_id(self, mongo):
        mongo.return_value.__getitem__.return_value.find_one.return_value = {"recipient_id": "member-a"}
        response = ProtectedMediaView().get(self._media_request(), "certificates", "cert-1")
        self.assertEqual(response.status_code, 409)

    @patch("api.views.signed_cloudinary_delivery_url", side_effect=RuntimeError("unavailable"))
    @patch("api.views.mongo_db")
    def test_protected_media_returns_service_unavailable_on_signer_failure(self, mongo, _signed):
        mongo.return_value.__getitem__.return_value.find_one.return_value = {"public_id": "certificate/1", "recipient_id": "member-a"}
        response = ProtectedMediaView().get(self._media_request(), "certificates", "cert-1")
        self.assertEqual(response.status_code, 503)

    @patch("api.views.mongo_db")
    def test_protected_media_returns_not_found_for_missing_record(self, mongo):
        mongo.return_value.__getitem__.return_value.find_one.return_value = None
        response = ProtectedMediaView().get(self._media_request(), "recordings", "missing")
        self.assertEqual(response.status_code, 404)


if __name__ == "__main__":
    unittest.main()
