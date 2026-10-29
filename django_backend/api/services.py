"""Business services kept separate from HTTP views for testability and provider isolation."""
from datetime import datetime, timedelta, timezone
import hashlib
import json
import secrets
import smtplib
import socket
from email.message import EmailMessage
from typing import Any

import bcrypt
from django.conf import settings
from pymongo import ASCENDING, DESCENDING, MongoClient


_client = None
_using_mock = False


def _init_mock_db(db):
    try:
        from api.seed_questions import seed_database
        seed_database(db)
    except Exception:
        pass


def mongo_db():
    global _client, _using_mock
    if _client is None:
        try:
            client = MongoClient(settings.MONGODB_URI, serverSelectionTimeoutMS=800)
            client.admin.command("ping")
            _client = client
            _using_mock = False
        except Exception:
            import mongomock
            _client = mongomock.MongoClient()
            _using_mock = True
            _init_mock_db(_client[settings.MONGODB_DATABASE])
    return _client[settings.MONGODB_DATABASE]


def ensure_indexes() -> None:
    db = mongo_db()
    db.users.create_index("email", unique=True)
    db.skills.create_index("slug", unique=True)
    db.user_skills.create_index([("user_id", ASCENDING), ("skill_id", ASCENDING), ("direction", ASCENDING)], unique=True)
    db.messages.create_index([("conversation_id", ASCENDING), ("sent_at", DESCENDING)])
    db.activity_logs.create_index([("created_at", DESCENDING), ("module", ASCENDING)])
    db.audit_logs.create_index([("created_at", DESCENDING), ("actor_id", ASCENDING)])
    db.certificates.create_index("verification_token", unique=True)


def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")


def check_password(password: str, stored_hash: str) -> bool:
    return bcrypt.checkpw(password.encode("utf-8"), stored_hash.encode("utf-8"))


def issue_otp(email: str, purpose: str = "email_verification") -> str:
    code = f"{secrets.randbelow(1_000_000):06d}"
    digest = hashlib.sha256(code.encode("utf-8")).hexdigest()
    now = datetime.now(timezone.utc)
    mongo_db().otp_tokens.update_many({"email": email.lower(), "purpose": purpose, "used_at": None}, {"$set": {"used_at": now}})
    mongo_db().otp_tokens.insert_one({"email": email.lower(), "purpose": purpose, "digest": digest, "attempts": 0, "created_at": now, "expires_at": now + timedelta(minutes=10), "used_at": None})
    try:
        send_otp_email(email, code)
    except RuntimeError:
        if not settings.DEBUG:
            raise
        print(f"[DEV EMAIL] OTP for {email}: {code}")
    return code


def verify_otp(email: str, code: str, purpose: str = "email_verification") -> bool:
    now = datetime.now(timezone.utc)
    digest = hashlib.sha256(code.encode("utf-8")).hexdigest()
    record = mongo_db().otp_tokens.find_one({"email": email.lower(), "purpose": purpose, "digest": digest, "used_at": None, "expires_at": {"$gt": now}})
    if not record:
        mongo_db().otp_tokens.update_one({"email": email.lower(), "purpose": purpose, "used_at": None}, {"$inc": {"attempts": 1}})
        return False
    mongo_db().otp_tokens.update_one({"_id": record["_id"]}, {"$set": {"used_at": now}})
    return True


def _smtp_error_detail(exc: Exception) -> str:
    """Translate low-level SMTP failures into operator-actionable messages."""
    if isinstance(exc, smtplib.SMTPAuthenticationError):
        code = getattr(exc, "smtp_code", "")
        if code == 535 or "BadCredentials" in str(getattr(exc, "smtp_error", "")):
            return (
                "Gmail rejected the SMTP credentials (535 BadCredentials). "
                "SMTP_USERNAME must be a real Gmail address and SMTP_PASSWORD must be a "
                "16-character Google App Password (create one at Google Account > Security > 2-Step Verification > App passwords)."
            )
        return f"Gmail rejected the SMTP credentials ({code})."
    if isinstance(exc, smtplib.SMTPSenderRefused):
        return (
            "Gmail refused the sender address. DEFAULT_FROM_EMAIL must match the "
            "authenticated SMTP_USERNAME account."
        )
    if isinstance(exc, smtplib.SMTPNotSupportedError):
        return f"SMTP server {settings.SMTP_HOST}:{settings.SMTP_PORT} does not support STARTTLS."
    if isinstance(exc, (smtplib.SMTPConnectError, smtplib.SMTPServerDisconnected, TimeoutError, socket.timeout)):
        return f"Could not reach SMTP server {settings.SMTP_HOST}:{settings.SMTP_PORT} (network blocked or server down)."
    return "Gmail SMTP delivery failed unexpectedly."


def send_otp_email(recipient: str, code: str) -> None:
    if not settings.SMTP_USERNAME or not settings.SMTP_PASSWORD:
        raise RuntimeError(
            "SMTP credentials are not configured. Set SMTP_USERNAME and SMTP_PASSWORD "
            "(a Gmail App Password) in the backend .env, then restart Django."
        )
    if "@" not in settings.SMTP_USERNAME or "demo" in settings.SMTP_USERNAME.lower():
        raise RuntimeError(
            f"SMTP_USERNAME '{settings.SMTP_USERNAME}' looks like a placeholder. "
            "Set a real Gmail account plus a 16-character Google App Password before sending email."
        )
    message = EmailMessage()
    message["Subject"] = "Your Skill-Swap verification code"
    message["From"] = settings.DEFAULT_FROM_EMAIL
    message["To"] = recipient
    message.set_content(f"Your Skill-Swap verification code is {code}. It expires in 10 minutes and can be used once.")
    try:
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT, timeout=15) as smtp:
            smtp.ehlo()
            smtp.starttls()
            smtp.ehlo()
            smtp.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            smtp.send_message(message)
    except (OSError, smtplib.SMTPException) as exc:
        raise RuntimeError(_smtp_error_detail(exc)) from exc


def create_access_token(user: dict[str, Any]) -> str:
    import jwt
    now = datetime.now(timezone.utc)
    return jwt.encode({"sub": str(user["id"]), "role": user.get("role", "user"), "status": user.get("status", "active"), "token_type": "access", "jti": secrets.token_urlsafe(18), "iat": now, "exp": now + timedelta(minutes=settings.JWT_ACCESS_MINUTES)}, settings.JWT_SECRET, algorithm="HS256")


def issue_zegocloud_credentials(session: dict[str, Any], user_id: str) -> dict[str, str]:
    if not settings.ZEGO_APP_ID or not settings.ZEGO_SERVER_SECRET:
        raise RuntimeError(
            "ZegoCloud credentials are not configured. Set ZEGO_APP_ID and "
            "ZEGO_SERVER_SECRET (console.zegocloud.com > Project Settings) in the backend .env."
        )
    if settings.ZEGO_APP_ID == "1234567890" or settings.ZEGO_SERVER_SECRET.startswith("0123456789abcdef"):
        raise RuntimeError(
            "ZegoCloud credentials are still the template placeholders. Create a project at "
            "console.zegocloud.com (Token sign-on) and set the real ZEGO_APP_ID and ZEGO_SERVER_SECRET."
        )
    participant_ids = session.get("participant_ids") or [session.get("participant_a_id"), session.get("participant_b_id")]
    if str(user_id) not in {str(participant) for participant in participant_ids if participant is not None}:
        raise PermissionError("User is not a session participant")
    room_id = str(session.get("room_id") or session.get("id"))
    from .zego_token04 import generate_token04
    token = generate_token04(int(settings.ZEGO_APP_ID), str(user_id), settings.ZEGO_SERVER_SECRET, 900, json.dumps({"room_id": room_id, "privilege": {1: 1, 2: 1}, "stream_id_list": None}))
    return {"app_id": settings.ZEGO_APP_ID, "room_id": room_id, "user_id": str(user_id), "token": token, "expires_in": "900"}


def certificate_verification_token(session_id: str) -> str:
    return hashlib.sha256(f"{session_id}:{secrets.token_urlsafe(32)}".encode("utf-8")).hexdigest()


def issue_certificate_once(session: dict[str, Any], recipient_id: str, skill_name: str) -> dict[str, Any]:
    db = mongo_db()
    existing = db.certificates.find_one({"session_id": session["id"], "recipient_id": str(recipient_id), "status": {"$ne": "revoked"}})
    if existing:
        return existing
    now = datetime.now(timezone.utc)
    certificate = {"certificate_no": f"SS-{now.year}-{secrets.randbelow(90000) + 10000}", "session_id": session["id"], "recipient_id": str(recipient_id), "skill": skill_name, "status": "issued", "verification_token": certificate_verification_token(session["id"]), "issued_at": now, "asset_url": None}
    db.certificates.insert_one(certificate)
    return certificate



def _cloudinary_credentials_look_placeholder() -> bool:
    return (
        settings.CLOUDINARY_CLOUD_NAME in {"demo-cloud", "your-cloud-name"}
        or settings.CLOUDINARY_API_KEY in {"123456789012345", "your-api-key"}
        or settings.CLOUDINARY_API_SECRET.lower().startswith("sample")
        or settings.CLOUDINARY_API_SECRET == "your-api-secret"
    )


def _cloudinary_config():
    if not settings.CLOUDINARY_CLOUD_NAME or not settings.CLOUDINARY_API_KEY or not settings.CLOUDINARY_API_SECRET:
        raise RuntimeError(
            "Cloudinary credentials are not configured. Set CLOUDINARY_CLOUD_NAME, "
            "CLOUDINARY_API_KEY and CLOUDINARY_API_SECRET (Console dashboard > Product "
            "Environment Credentials) in the backend .env, then restart Django."
        )
    if _cloudinary_credentials_look_placeholder():
        raise RuntimeError(
            f"Cloudinary credentials look like placeholders (cloud='{settings.CLOUDINARY_CLOUD_NAME}'). "
            "Set the real values from your Cloudinary Console dashboard."
        )
    import cloudinary

    cloudinary.config(
        cloud_name=settings.CLOUDINARY_CLOUD_NAME,
        api_key=settings.CLOUDINARY_API_KEY,
        api_secret=settings.CLOUDINARY_API_SECRET,
        secure=True,
    )


def upload_cloudinary_asset(file_bytes: bytes, public_id: str, resource_type: str = "image") -> dict[str, str]:
    """Upload bytes using Cloudinary's server SDK; return metadata, never the API secret."""
    _cloudinary_config()
    import cloudinary
    import cloudinary.uploader

    try:
        result = cloudinary.uploader.upload(file_bytes, public_id=public_id, resource_type=resource_type, type="authenticated", overwrite=False)
    except Exception as exc:  # cloudinary raises generic Error subclasses
        detail = str(getattr(exc, "args", [""])[0] or exc)
        if "401" in detail or "Invalid" in detail or "auth" in detail.lower():
            raise RuntimeError(
                "Cloudinary rejected the upload credentials (401). Verify CLOUDINARY_API_KEY "
                "and CLOUDINARY_API_SECRET match the Console dashboard."
            ) from exc
        raise RuntimeError(f"Cloudinary upload failed: {detail}") from exc
    return {"asset_id": str(result.get("asset_id", "")), "public_id": str(result.get("public_id", "")), "resource_type": str(result.get("resource_type", resource_type)), "version": str(result.get("version", ""))}


def signed_cloudinary_delivery_url(public_id: str, resource_type: str = "image", expires_seconds: int = 300) -> str:
    """Return a short-lived authenticated delivery URL; no raw credential is returned."""
    _cloudinary_config()
    import cloudinary
    import cloudinary.utils

    url, _ = cloudinary.utils.private_download_url(public_id, resource_type=resource_type, attachment=False, expires_at=int(datetime.now(timezone.utc).timestamp()) + expires_seconds)
    return url
