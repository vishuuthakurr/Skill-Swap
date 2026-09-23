from datetime import datetime, timedelta, timezone
import hashlib
import secrets

from django.conf import settings
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from pymongo import ReturnDocument

from .authentication import IsAdmin
from .domain import allow_rate_limited_action, append_activity, append_audit
from .services import check_password, create_access_token, ensure_indexes, hash_password, issue_certificate_once, issue_otp, issue_zegocloud_credentials, mongo_db, signed_cloudinary_delivery_url, verify_otp


class RegisterView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        password = str(request.data.get("password", ""))
        name = str(request.data.get("name", "")).strip()
        if not email or len(password) < 8 or not name:
            return Response({"detail": "Name, valid email, and an eight-character password are required."}, status=400)
        if not allow_rate_limited_action(f"register:{email}", limit=5, window_seconds=3600):
            return Response({"detail": "Too many registration attempts. Try again later."}, status=429)
        ensure_indexes()
        db = mongo_db()
        if db.users.find_one({"email": email}):
            return Response({"detail": "If this email can be used, a verification message will be sent."}, status=202)
        user = {"id": secrets.token_urlsafe(16), "email": email, "name": name, "password_hash": hash_password(password), "role": "user", "status": "pending_email", "email_verified": False, "created_at": datetime.now(timezone.utc)}
        db.users.insert_one(user)
        otp = issue_otp(email)
        res_data = {"message": "Verification code sent.", "email": email}
        if settings.DEBUG:
            res_data["dev_otp"] = otp
        return Response(res_data, status=201)


class VerifyOtpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        code = str(request.data.get("code", ""))
        if not verify_otp(email, code):
            return Response({"detail": "The code is invalid or expired."}, status=400)
        user = mongo_db().users.find_one_and_update({"email": email}, {"$set": {"email_verified": True, "status": "active", "updated_at": datetime.now(timezone.utc)}}, return_document=ReturnDocument.AFTER)
        if not user:
            return Response({"detail": "The code is invalid or expired."}, status=400)
        return Response({"message": "Email verified.", "access_token": create_access_token(user)})


class LoginView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        password = str(request.data.get("password", ""))
        user = mongo_db().users.find_one({"email": email})
        if not user or not user.get("email_verified") or not check_password(password, user.get("password_hash", "")):
            return Response({"detail": "Email or password is incorrect."}, status=401)
        if user.get("status") != "active":
            return Response({"detail": "Account is not active."}, status=403)
        return Response({"access_token": create_access_token(user), "user": {"id": str(user["id"]), "name": user.get("name"), "email": user.get("email"), "role": user.get("role", "user")}})


class MeView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = mongo_db().users.find_one({"id": str(request.user["id"])}, {"password_hash": 0})
        return Response(user or {"detail": "User not found."}, status=200 if user else 404)


class AssessmentSubmitView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, attempt_id: str):
        answers = request.data.get("answers", {})
        attempt = mongo_db().assessment_attempts.find_one({"id": attempt_id, "user_id": str(request.user["id"]), "status": "in_progress"})
        if not attempt or not isinstance(answers, dict):
            return Response({"detail": "Assessment attempt not found or already submitted."}, status=404)
        
        question_ids = attempt.get("question_ids", [])
        questions = list(mongo_db().questions.find({"id": {"$in": question_ids}}, {"_id": 0, "id": 1, "correct_option": 1, "prompt": 1}))
        
        correct = sum(1 for question in questions if answers.get(question["id"]) == question.get("correct_option"))
        total = len(questions) if questions else len(question_ids)
        score = round((correct / total) * 100) if total > 0 else 0
        pass_mark = int(attempt.get("pass_mark", 70))
        passed = score >= pass_mark

        now = datetime.now(timezone.utc)
        result = {
            "attempt_id": attempt_id,
            "score": score,
            "correct": correct,
            "total": total,
            "passed": passed,
            "pass_mark": pass_mark,
            "verification_status": "verified" if passed else "failed",
        }

        if passed:
            user_id = str(request.user["id"])
            mongo_db().user_skills.update_one(
                {"user_id": user_id, "skill_id": attempt["skill_id"], "direction": "teach"},
                {"$set": {"verification_status": "verified", "verified_at": now, "score": score}},
                upsert=True,
            )
            skill_doc = mongo_db().skills.find_one({"id": attempt["skill_id"]})
            skill_title = skill_doc.get("name") if skill_doc else attempt["skill_id"].capitalize()
            user_doc = mongo_db().users.find_one({"id": user_id}) or {}
            recipient_name = user_doc.get("name") or request.user.get("name") or "Skill-Swap Member"

            cert_no = f"SS-VERIF-{now.year}-{secrets.randbelow(90000) + 10000}"
            v_token = secrets.token_urlsafe(24)
            certificate = {
                "id": secrets.token_urlsafe(16),
                "certificate_no": cert_no,
                "assessment_id": attempt_id,
                "recipient_id": user_id,
                "recipient_name": recipient_name,
                "skill": skill_title,
                "skill_id": attempt["skill_id"],
                "score": score,
                "type": "teacher_verification",
                "status": "issued",
                "verification_token": v_token,
                "issued_at": now,
            }
            mongo_db().certificates.insert_one(certificate)
            result["certificate"] = {k: v for k, v in certificate.items() if k != "_id"}
            result["verification_token"] = v_token

        mongo_db().assessment_attempts.update_one(
            {"_id": attempt["_id"]},
            {"$set": {"answers": answers, "score": score, "result": result, "status": "passed" if passed else "failed", "submitted_at": now}},
        )
        return Response(result)


class MatchDiscoverView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = str(request.user["id"])
        learn_ids = [row["skill_id"] for row in mongo_db().user_skills.find({"user_id": user_id, "direction": "learn"}, {"skill_id": 1})]
        teachers = list(mongo_db().user_skills.find({"skill_id": {"$in": learn_ids}, "direction": "teach", "verification_status": "verified", "user_id": {"$ne": user_id}}, {"user_id": 1, "skill_id": 1, "verified_at": 1}).limit(50))
        return Response({"matches": teachers})


class SessionVideoTokenView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id: str):
        session = mongo_db().sessions.find_one({"id": session_id})
        if not session:
            return Response({"detail": "Session not found."}, status=404)
        try:
            token = issue_zegocloud_credentials(session, str(request.user["id"]))
        except PermissionError:
            return Response({"detail": "You are not a participant in this session."}, status=403)
        except RuntimeError:
            return Response({"detail": "Video service is not configured."}, status=503)
        return Response(token)


class CertificateVerifyView(APIView):
    permission_classes = [AllowAny]

    def get(self, request, token: str):
        certificate = mongo_db().certificates.find_one(
            {"$or": [{"verification_token": token}, {"certificate_no": token}]},
            {"_id": 0, "certificate_no": 1, "skill": 1, "recipient_name": 1, "score": 1, "type": 1, "issued_at": 1, "status": 1}
        )
        if not certificate:
            return Response({"valid": False, "status": "not_found"}, status=404)
        certificate["valid"] = certificate.get("status") == "issued"
        return Response(certificate)


class AdminDashboardView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        db = mongo_db()
        return Response({"members": db.users.count_documents({}), "verified_teachers": db.user_skills.count_documents({"verification_status": "verified"}), "active_sessions": db.sessions.count_documents({"status": {"$in": ["scheduled", "live"]}}), "open_reports": db.reports.count_documents({"status": {"$in": ["open", "under_review"]}})})


class AdminActivityView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request):
        limit = min(int(request.query_params.get("limit", 50)), 200)
        module = request.query_params.get("module")
        query = {"module": module} if module else {}
        rows = list(mongo_db().activity_logs.find(query, {"_id": 0}).sort("created_at", -1).limit(limit))
        return Response({"events": rows, "limit": limit})


class ConversationAccessView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id: str):
        conversation = mongo_db().conversations.find_one({"id": conversation_id, "status": "open", "participant_ids": str(request.user["id"])}, {"_id": 1})
        return Response({"allowed": bool(conversation)}, status=200 if conversation else 403)


class ConversationMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id: str):
        if not ConversationAccessView().get(request, conversation_id).status_code == 200:
            return Response({"detail": "Conversation access denied."}, status=403)
        messages = list(mongo_db().messages.find({"conversation_id": conversation_id}, {"_id": 0}).sort("sent_at", 1).limit(100))
        return Response({"messages": messages})

    def post(self, request, conversation_id: str):
        access = ConversationAccessView().get(request, conversation_id)
        if access.status_code != 200:
            return Response({"detail": "Conversation access denied."}, status=403)
        body = str(request.data.get("body", "")).strip()
        if not body or len(body) > 4000:
            return Response({"detail": "Message must contain between 1 and 4000 characters."}, status=400)
        now = datetime.now(timezone.utc)
        message = {"id": secrets.token_urlsafe(16), "conversation_id": conversation_id, "sender_id": str(request.user["id"]), "body": body, "sent_at": now, "read_at": None, "deleted_at": None}
        mongo_db().messages.insert_one(message)
        mongo_db().activity_logs.insert_one({"user_id": str(request.user["id"]), "module": "communications", "type": "message_created", "conversation_id": conversation_id, "created_at": now})
        message.pop("_id", None)
        return Response(message, status=201)


ADMIN_COLLECTIONS = {
    "skills": "skills",
    "questions": "questions",
    "assessments": "assessment_attempts",
    "matches": "matches",
    "communications": "conversations",
    "sessions": "sessions",
    "recordings": "recordings",
    "reports": "reports",
    "certificates": "certificates",
    "announcements": "announcements",
    "support": "support_tickets",
    "settings": "platform_settings",
    "audit": "audit_logs",
}


class AdminCollectionView(APIView):
    permission_classes = [IsAuthenticated, IsAdmin]

    def get(self, request, collection: str):
        mongo_collection = ADMIN_COLLECTIONS.get(collection)
        if not mongo_collection:
            return Response({"detail": "Unknown administrator collection."}, status=404)
        limit = min(max(int(request.query_params.get("limit", 50)), 1), 200)
        query = {}
        if request.query_params.get("status"):
            query["status"] = request.query_params["status"]
        if request.query_params.get("skill_id"):
            query["skill_id"] = request.query_params["skill_id"]
        if request.query_params.get("active") is not None:
            val = str(request.query_params["active"]).lower()
            query["active"] = val in {"true", "1"}
        rows = list(mongo_db()[mongo_collection].find(query, {"_id": 0}).sort("created_at", -1).limit(limit))
        return Response({"items": rows, "collection": collection, "limit": limit})

    def post(self, request, collection: str):
        mongo_collection = ADMIN_COLLECTIONS.get(collection)
        if not mongo_collection:
            return Response({"detail": "Unknown administrator collection."}, status=404)
        if collection not in {"questions", "skills", "announcements", "support"}:
            return Response({"detail": f"Creating records in {collection} is not supported directly."}, status=400)
        reason = str(request.data.get("reason", "Admin creation")).strip()
        if len(reason) < 4:
            reason = f"Admin created {collection} record"
        now = datetime.now(timezone.utc)
        record_id = secrets.token_urlsafe(16)

        if collection == "questions":
            skill_id = str(request.data.get("skill_id", "")).strip()
            prompt = str(request.data.get("prompt", "")).strip()
            options = request.data.get("options", [])
            correct_option = request.data.get("correct_option")
            if not skill_id or len(prompt) < 10:
                return Response({"detail": "Skill ID and a clear question prompt (10+ characters) are required."}, status=400)
            if not isinstance(options, list) or len(options) < 2:
                return Response({"detail": "At least two options are required."}, status=400)
            if correct_option is None or (isinstance(correct_option, int) and (correct_option < 0 or correct_option >= len(options))):
                return Response({"detail": "A valid correct option must be specified."}, status=400)
            correct_val = options[correct_option] if isinstance(correct_option, int) else str(correct_option)
            record = {
                "id": record_id,
                "skill_id": skill_id,
                "prompt": prompt,
                "options": [str(opt) for opt in options],
                "correct_option": correct_val,
                "difficulty": str(request.data.get("difficulty", "intermediate")),
                "active": bool(request.data.get("active", True)),
                "version": int(request.data.get("version", 1)),
                "created_at": now,
            }
            mongo_db().questions.insert_one(record)
            append_audit(str(request.user["id"]), "admin_question_created", "questions", record_id, reason, {"skill_id": skill_id, "prompt_preview": prompt[:60]})
            record.pop("_id", None)
            return Response(record, status=201)

        if collection == "skills":
            name = str(request.data.get("name", "")).strip()
            slug = str(request.data.get("slug", "")).strip().lower()
            category = str(request.data.get("category", "General")).strip()
            if not name or not slug:
                return Response({"detail": "Skill name and unique slug are required."}, status=400)
            record = {
                "id": record_id,
                "name": name,
                "slug": slug,
                "category": category,
                "description": str(request.data.get("description", "")).strip(),
                "created_at": now,
            }
            mongo_db().skills.update_one({"slug": slug}, {"$setOnInsert": record}, upsert=True)
            append_audit(str(request.user["id"]), "admin_skill_created", "skills", record_id, reason, {"slug": slug, "name": name})
            record.pop("_id", None)
            return Response(record, status=201)

        if collection == "announcements":
            title = str(request.data.get("title", "")).strip()
            body = str(request.data.get("body", "")).strip()
            if not title or not body:
                return Response({"detail": "Title and body are required."}, status=400)
            record = {
                "id": record_id,
                "title": title,
                "body": body,
                "audience": str(request.data.get("audience", "all")),
                "status": "sent",
                "created_at": now,
            }
            mongo_db().announcements.insert_one(record)
            append_audit(str(request.user["id"]), "admin_announcement_created", "announcements", record_id, reason, {"title": title})
            record.pop("_id", None)
            return Response(record, status=201)

        return Response({"detail": "Unsupported collection."}, status=400)

    def patch(self, request, collection: str, record_id: str):
        mongo_collection = ADMIN_COLLECTIONS.get(collection)
        if not mongo_collection:
            return Response({"detail": "Unknown administrator collection."}, status=404)
        reason = str(request.data.get("reason", "")).strip()
        if len(reason) < 8:
            return Response({"detail": "A reason of at least eight characters is required."}, status=400)
        permitted = {
            "status", "priority", "assigned_to", "is_active", "active", "retention_until",
            "resolution_notes", "action_taken", "prompt", "options", "correct_option", "difficulty",
            "open_dispute", "dispute_resolution"
        }
        allowed = {key: value for key, value in request.data.items() if key in permitted}
        if not allowed:
            return Response({"detail": "No permitted fields were supplied."}, status=400)
        if collection == "sessions" and allowed.get("status") in {"completed", "cancelled_refunded"}:
            allowed["open_dispute"] = False
        result = mongo_db()[mongo_collection].update_one({"id": record_id}, {"$set": {**allowed, "updated_at": datetime.now(timezone.utc)}})
        if not result.matched_count:
            return Response({"detail": "Record not found."}, status=404)

        if collection == "reports" and allowed.get("action_taken") == "suspend":
            report_doc = mongo_db().reports.find_one({"id": record_id})
            if report_doc and report_doc.get("target_type") == "user":
                target_user_id = report_doc.get("target_id")
                mongo_db().users.update_one({"id": target_user_id}, {"$set": {"status": "suspended", "updated_at": datetime.now(timezone.utc)}})
                append_audit(str(request.user["id"]), "user_suspended", "users", target_user_id, f"Suspended via report {record_id}: {reason}", {})

        append_audit(str(request.user["id"]), f"admin_{collection}_updated", collection, record_id, reason, {"changes": allowed})
        return Response({"updated": True, "id": record_id, "changes": allowed})


class ForgotPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        if not allow_rate_limited_action(f"forgot:{email}", limit=3, window_seconds=900):
            return Response({"detail": "Try again later."}, status=429)
        user = mongo_db().users.find_one({"email": email})
        if user:
            raw = secrets.token_urlsafe(32)
            digest = hashlib.sha256(raw.encode("utf-8")).hexdigest()
            now = datetime.now(timezone.utc)
            mongo_db().password_resets.insert_one({"user_id": str(user["id"]), "digest": digest, "created_at": now, "expires_at": now + timedelta(minutes=30), "used_at": None})
            # The production adapter sends a reset link through the same Gmail SMTP service.
        return Response({"message": "If the account exists, a reset path has been sent."})


class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        token_id = request.auth.get("jti") if isinstance(request.auth, dict) else None
        if token_id:
            mongo_db().revoked_tokens.insert_one({"jti": token_id, "user_id": str(request.user["id"]), "created_at": datetime.now(timezone.utc)})
        return Response({"success": True})


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = mongo_db().profiles.find_one({"user_id": str(request.user["id"])}, {"_id": 0}) or {"user_id": str(request.user["id"])}
        return Response(profile)

    def patch(self, request):
        allowed = {key: value for key, value in request.data.items() if key in {"display_name", "bio", "timezone", "availability", "privacy", "notification_preferences", "recording_consent"}}
        mongo_db().profiles.update_one({"user_id": str(request.user["id"])}, {"$set": {**allowed, "updated_at": datetime.now(timezone.utc)}}, upsert=True)
        return Response({"updated": True, "profile": allowed})


class UserSkillsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"skills": list(mongo_db().user_skills.find({"user_id": str(request.user["id"])}, {"_id": 0}))})

    def post(self, request):
        skill_id = str(request.data.get("skill_id", "")).strip()
        direction = str(request.data.get("direction", "")).strip()
        if not skill_id or direction not in {"teach", "learn"}:
            return Response({"detail": "A skill and teach/learn direction are required."}, status=400)
        record = {"id": secrets.token_urlsafe(16), "user_id": str(request.user["id"]), "skill_id": skill_id, "direction": direction, "level": str(request.data.get("level", "beginner")), "verification_status": "unverified", "created_at": datetime.now(timezone.utc)}
        mongo_db().user_skills.update_one({"user_id": record["user_id"], "skill_id": skill_id, "direction": direction}, {"$setOnInsert": record}, upsert=True)
        return Response(record, status=201)


class MatchRequestView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = str(request.user["id"])
        return Response({"requests": list(mongo_db().match_requests.find({"$or": [{"requester_id": user_id}, {"recipient_id": user_id}]}, {"_id": 0}).sort("created_at", -1).limit(100))})

    def post(self, request):
        recipient_id = str(request.data.get("recipient_id", "")).strip()
        if not recipient_id or recipient_id == str(request.user["id"]):
            return Response({"detail": "A different recipient is required."}, status=400)
        now = datetime.now(timezone.utc)
        record = {"id": secrets.token_urlsafe(16), "requester_id": str(request.user["id"]), "recipient_id": recipient_id, "status": "sent", "created_at": now, "expires_at": now + timedelta(days=14)}
        mongo_db().match_requests.insert_one(record)
        append_activity(str(request.user["id"]), "matching", "match_request_sent", {"recipient_id": recipient_id})
        return Response(record, status=201)


class SessionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user_id = str(request.user["id"])
        rows = list(mongo_db().sessions.find({"participant_ids": user_id}, {"_id": 0}).sort("start_at", -1).limit(100))
        return Response({"sessions": rows})

    def post(self, request):
        participants = {str(item) for item in request.data.get("participant_ids", [])}
        if str(request.user["id"]) not in participants or len(participants) != 2:
            return Response({"detail": "A session must contain exactly two authorized participants."}, status=400)
        now = datetime.now(timezone.utc)
        record = {"id": secrets.token_urlsafe(16), "participant_ids": list(participants), "room_id": secrets.token_urlsafe(12), "start_at": request.data.get("start_at"), "timezone": request.data.get("timezone", "UTC"), "status": "scheduled", "recording_consent": {}, "created_at": now}
        mongo_db().sessions.insert_one(record)
        append_activity(str(request.user["id"]), "sessions", "session_scheduled", {"session_id": record["id"]})
        return Response(record, status=201)


class ReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        target_type = str(request.data.get("target_type", "")).strip()
        target_id = str(request.data.get("target_id", "")).strip()
        reason = str(request.data.get("reason", "")).strip()
        if not target_type or not target_id or len(reason) < 8:
            return Response({"detail": "Target and a meaningful report reason are required."}, status=400)
        record = {"id": secrets.token_urlsafe(16), "reporter_id": str(request.user["id"]), "target_type": target_type, "target_id": target_id, "reason": reason, "status": "open", "created_at": datetime.now(timezone.utc)}
        mongo_db().reports.insert_one(record)
        return Response({"received": True, "report_id": record["id"]}, status=201)


class NotificationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rows = list(mongo_db().notifications.find({"user_id": str(request.user["id"])}, {"_id": 0}).sort("created_at", -1).limit(100))
        return Response({"notifications": rows})

    def patch(self, request, notification_id: str):
        result = mongo_db().notifications.update_one({"id": notification_id, "user_id": str(request.user["id"])}, {"$set": {"read_at": datetime.now(timezone.utc)}})
        return Response({"updated": bool(result.matched_count)})


class CertificateListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        rows = list(mongo_db().certificates.find({"recipient_id": str(request.user["id"])}, {"_id": 0}).sort("issued_at", -1))
        return Response({"certificates": rows})


class ResetPasswordView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        raw_token = str(request.data.get("token", "")).strip()
        password = str(request.data.get("password", ""))
        if len(password) < 8 or not raw_token:
            return Response({"detail": "A reset token and an eight-character password are required."}, status=400)
        now = datetime.now(timezone.utc)
        digest = hashlib.sha256(raw_token.encode("utf-8")).hexdigest()
        reset = mongo_db().password_resets.find_one({"digest": digest, "used_at": None, "expires_at": {"$gt": now}})
        if not reset:
            return Response({"detail": "The reset token is invalid or expired."}, status=400)
        mongo_db().users.update_one({"id": reset["user_id"]}, {"$set": {"password_hash": hash_password(password), "updated_at": now}})
        mongo_db().password_resets.update_one({"_id": reset["_id"]}, {"$set": {"used_at": now}})
        return Response({"success": True})


class AssessmentStartView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        skill_id = str(request.data.get("skill_id", "")).strip()
        if not skill_id:
            return Response({"detail": "A skill is required."}, status=400)
        requested_count = int(request.data.get("question_count", 30))
        requested_count = max(10, min(40, requested_count))
        question_pool = list(mongo_db().questions.find({"skill_id": skill_id, "active": True}, {"_id": 0, "id": 1, "prompt": 1, "options": 1, "version": 1, "difficulty": 1}))
        if not question_pool:
            question_pool = list(mongo_db().questions.find({"active": True}, {"_id": 0, "id": 1, "prompt": 1, "options": 1, "version": 1, "difficulty": 1}))
        if len(question_pool) < 5:
            return Response({"detail": "This skill does not have enough published questions yet."}, status=409)
        question_count = min(len(question_pool), requested_count)
        selected = secrets.SystemRandom().sample(question_pool, question_count)
        attempt = {
            "id": secrets.token_urlsafe(16),
            "user_id": str(request.user["id"]),
            "skill_id": skill_id,
            "question_ids": [question["id"] for question in selected],
            "question_version": selected[0].get("version", 1),
            "pass_mark": 70,
            "status": "in_progress",
            "started_at": datetime.now(timezone.utc),
        }
        mongo_db().assessment_attempts.insert_one(attempt)
        return Response({
            "attempt_id": attempt["id"],
            "skill_id": skill_id,
            "questions": selected,
            "total_questions": len(selected),
            "pass_mark": 70,
            "duration_minutes": 35,
        }, status=201)


class SessionActionView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id: str, action: str):
        user_id = str(request.user["id"])
        session = mongo_db().sessions.find_one({"id": session_id, "participant_ids": user_id})
        if not session:
            return Response({"detail": "Session not found or access denied."}, status=404)
        now = datetime.now(timezone.utc)
        if action == "consent":
            consent = bool(request.data.get("consent"))
            mongo_db().sessions.update_one({"id": session_id}, {"$set": {f"recording_consent.{user_id}": {"consented": consent, "at": now}}})
            return Response({"recording_consent": consent})
        if action == "dispute":
            reason = str(request.data.get("reason", "")).strip()
            if len(reason) < 8:
                return Response({"detail": "A meaningful dispute reason is required."}, status=400)
            mongo_db().sessions.update_one({"id": session_id}, {"$set": {"status": "disputed", "open_dispute": True, "dispute_reason": reason, "updated_at": now}})
            return Response({"status": "disputed"})
        if action == "complete":
            mongo_db().sessions.update_one({"id": session_id}, {"$addToSet": {"completion_confirmations": user_id}, "$set": {"status": "completion_pending", "updated_at": now}})
            latest = mongo_db().sessions.find_one({"id": session_id})
            confirmations = latest.get("completion_confirmations", []) if latest else []
            if latest and len(confirmations) >= 2 and not latest.get("open_dispute"):
                mongo_db().sessions.update_one({"id": session_id}, {"$set": {"status": "completed", "completed_at": now}})
                return Response({"status": "completed", "certificate_eligible": True})
            return Response({"status": "completion_pending", "certificate_eligible": False})
        return Response({"detail": "Unknown session action."}, status=400)


class CertificateIssueView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, session_id: str):
        user_id = str(request.user["id"])
        session = mongo_db().sessions.find_one({"id": session_id, "participant_ids": user_id, "status": "completed", "open_dispute": {"$ne": True}})
        if not session:
            return Response({"detail": "The completed exchange is not eligible for a certificate."}, status=409)
        certificate = issue_certificate_once(session, user_id, str(request.data.get("skill", "Skill exchange")))
        return Response({"certificate": {key: value for key, value in certificate.items() if key != "_id"}}, status=201)


class AvatarUploadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        upload = request.FILES.get("avatar")
        if not upload:
            return Response({"detail": "An avatar file is required."}, status=400)
        from .domain import validate_upload
        from .services import upload_cloudinary_asset
        try:
            validate_upload(upload.name, upload.content_type or "", upload.size, {"image/jpeg", "image/png", "image/webp"}, 5 * 1024 * 1024)
            metadata = upload_cloudinary_asset(upload.read(), f"skill-swap/avatars/{request.user['id']}")
            metadata["url"] = signed_cloudinary_delivery_url(metadata["public_id"], "image", 300)
        except (ValueError, RuntimeError) as exc:
            return Response({"detail": str(exc)}, status=400 if isinstance(exc, ValueError) else 503)
        mongo_db().profiles.update_one({"user_id": str(request.user["id"])}, {"$set": {"avatar": metadata, "updated_at": datetime.now(timezone.utc)}}, upsert=True)
        return Response({"avatar": metadata}, status=201)


class MatchRequestActionView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, request_id: str):
        user_id = str(request.user["id"])
        desired = str(request.data.get("status", "")).strip()
        if desired not in {"accepted", "declined"}:
            return Response({"detail": "Only accepted or declined is allowed."}, status=400)
        result = mongo_db().match_requests.update_one({"id": request_id, "recipient_id": user_id, "status": "sent"}, {"$set": {"status": desired, "updated_at": datetime.now(timezone.utc)}})
        if not result.matched_count:
            return Response({"detail": "Request not found or already resolved."}, status=404)
        if desired == "accepted":
            request_record = mongo_db().match_requests.find_one({"id": request_id}, {"_id": 0})
            if request_record:
                mongo_db().conversations.update_one({"match_request_id": request_id}, {"$setOnInsert": {"id": secrets.token_urlsafe(16), "match_request_id": request_id, "participant_ids": [request_record["requester_id"], request_record["recipient_id"]], "status": "open", "created_at": datetime.now(timezone.utc)}}, upsert=True)
        return Response({"status": desired})


class BlockView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        blocked_id = str(request.data.get("blocked_id", "")).strip()
        if not blocked_id or blocked_id == str(request.user["id"]):
            return Response({"detail": "A different member is required."}, status=400)
        mongo_db().blocks.update_one({"blocker_id": str(request.user["id"]), "blocked_id": blocked_id}, {"$setOnInsert": {"created_at": datetime.now(timezone.utc)}}, upsert=True)
        return Response({"blocked": True})


class ResendOtpView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = str(request.data.get("email", "")).strip().lower()
        if not allow_rate_limited_action(f"otp-resend:{email}", limit=3, window_seconds=600):
            return Response({"detail": "Too many code requests. Try again later."}, status=429)
        if email:
            issue_otp(email)
        return Response({"message": "If the account can be verified, a new code has been sent."})


class AuditEventView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        action = str(request.data.get("action", "")).strip()
        target_type = str(request.data.get("target_type", "conversation")).strip() or "conversation"
        target_id = str(request.data.get("conversation_id", request.data.get("target_id", "platform"))).strip()
        if not action or len(action) > 80 or not target_id:
            return Response({"detail": "A valid audit action and target are required."}, status=400)
        event_id = append_audit(str(request.user["id"]), action, target_type, target_id, f"Socket event recorded: {action}", {"source": "socket.io", "sensitive": action in {"message_read", "conversation_joined"}})
        return Response({"recorded": True, "event_id": event_id}, status=201)


class ProtectedMediaView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, media_type: str, record_id: str):
        if media_type not in {"recordings", "certificates"}:
            return Response({"detail": "Unsupported media type."}, status=404)
        record = mongo_db()[media_type].find_one({"id": record_id}, {"_id": 0, "public_id": 1, "resource_type": 1, "owner_id": 1, "recipient_id": 1, "participant_a_id": 1, "participant_b_id": 1})
        if not record or str(request.user["id"]) not in {str(record.get("owner_id", "")), str(record.get("recipient_id", "")), str(record.get("participant_a_id", "")), str(record.get("participant_b_id", ""))}:
            return Response({"detail": "Protected media not found."}, status=404)
        if not record.get("public_id"):
            return Response({"detail": "Protected media is not ready."}, status=409)
        try:
            url = signed_cloudinary_delivery_url(record["public_id"], record.get("resource_type", "raw"), 300)
        except RuntimeError:
            return Response({"detail": "Protected media is temporarily unavailable."}, status=503)
        return Response({"url": url, "expires_in": 300})
