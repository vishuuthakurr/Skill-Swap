"""Framework-independent business rules used by Django views and background/provider callbacks."""
from datetime import datetime, timedelta, timezone
import hashlib
import secrets
from typing import Any

from .services import mongo_db


STATE_TRANSITIONS: dict[str, dict[str, set[str]]] = {
    "match_request": {"candidate": {"sent"}, "sent": {"accepted", "declined", "expired"}, "accepted": set(), "declined": set(), "expired": set()},
    "session": {"draft": {"scheduled", "cancelled"}, "scheduled": {"ready", "cancelled", "disputed"}, "ready": {"live", "cancelled"}, "live": {"ended", "disputed"}, "ended": {"completion_pending", "disputed"}, "completion_pending": {"completed", "disputed"}, "completed": set(), "disputed": {"completed", "cancelled"}, "cancelled": set()},
    "report": {"open": {"assigned", "dismissed"}, "assigned": {"under_review"}, "under_review": {"resolved", "dismissed", "escalated"}, "escalated": {"under_review", "resolved"}, "resolved": set(), "dismissed": set()},
    "certificate": {"eligible": {"generating"}, "generating": {"issued", "revoked"}, "issued": {"revoked"}, "revoked": {"issued"}},
}


def transition(entity: str, current: str, next_state: str) -> str:
    allowed = STATE_TRANSITIONS.get(entity, {}).get(current, set())
    if next_state not in allowed:
        raise ValueError(f"Invalid {entity} transition: {current} → {next_state}")
    return next_state


def append_activity(user_id: str | None, module: str, event_type: str, metadata: dict[str, Any] | None = None) -> str:
    now = datetime.now(timezone.utc)
    event_id = secrets.token_urlsafe(16)
    mongo_db().activity_logs.insert_one({"id": event_id, "user_id": user_id, "module": module, "type": event_type, "metadata": metadata or {}, "created_at": now})
    return event_id


def append_audit(actor_id: str, action: str, target_type: str, target_id: str, reason: str, metadata: dict[str, Any] | None = None) -> str:
    if not reason or len(reason.strip()) < 8:
        raise ValueError("A meaningful reason is required for an audit event")
    now = datetime.now(timezone.utc)
    event_id = secrets.token_urlsafe(18)
    mongo_db().audit_logs.insert_one({"id": event_id, "actor_id": str(actor_id), "action": action, "target_type": target_type, "target_id": str(target_id), "reason": reason.strip(), "metadata": metadata or {}, "created_at": now, "immutable": True})
    return event_id


def allow_rate_limited_action(key: str, limit: int, window_seconds: int) -> bool:
    now = datetime.now(timezone.utc)
    digest = hashlib.sha256(key.encode("utf-8")).hexdigest()
    record = mongo_db().rate_limits.find_one({"key": digest})
    if not record or record["window_ends_at"] <= now:
        mongo_db().rate_limits.replace_one({"key": digest}, {"key": digest, "count": 1, "window_ends_at": now + timedelta(seconds=window_seconds)}, upsert=True)
        return True
    if record["count"] >= limit:
        return False
    mongo_db().rate_limits.update_one({"key": digest}, {"$inc": {"count": 1}})
    return True


def validate_upload(filename: str, mime_type: str, size_bytes: int, allowed_types: set[str], max_bytes: int) -> None:
    if mime_type not in allowed_types:
        raise ValueError("File type is not allowed")
    if size_bytes <= 0 or size_bytes > max_bytes:
        raise ValueError("File size is outside the allowed range")
    if not filename or filename.rsplit(".", 1)[-1].lower() not in {"jpg", "jpeg", "png", "webp", "pdf", "mp4", "webm"}:
        raise ValueError("File extension is not allowed")


def is_certificate_eligible(session: dict[str, Any]) -> bool:
    confirmations = session.get("completion_confirmations", [])
    confirmation_count = len(confirmations) if isinstance(confirmations, (list, tuple, set)) else int(session.get("participant_confirmations", 0) or 0)
    return session.get("status") == "completed" and confirmation_count >= 2 and not session.get("open_dispute", False)
