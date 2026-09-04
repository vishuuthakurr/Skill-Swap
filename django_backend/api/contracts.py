"""Stable response and idempotency primitives for the versioned API."""
from datetime import datetime, timezone
import hashlib
import json
from typing import Any

from rest_framework.response import Response

from .services import mongo_db


def ok(data: Any = None, *, status: int = 200) -> Response:
    return Response({"data": data, "error": None}, status=status)


def fail(detail: str, *, status: int = 400, code: str = "invalid_request") -> Response:
    return Response({"data": None, "error": {"code": code, "detail": detail}}, status=status)


def replay_or_reserve(actor_id: str, idempotency_key: str, operation: str, request_body: dict[str, Any]) -> tuple[dict[str, Any] | None, bool]:
    if not idempotency_key or len(idempotency_key) > 128:
        return None, False
    digest = hashlib.sha256(json.dumps(request_body, sort_keys=True, default=str).encode()).hexdigest()
    record = mongo_db().idempotency_keys.find_one({"actor_id": str(actor_id), "key": idempotency_key, "operation": operation}, {"_id": 0})
    if record:
        if record["request_digest"] != digest:
            raise ValueError("The idempotency key was already used for a different request")
        return record.get("response"), True
    mongo_db().idempotency_keys.insert_one({"actor_id": str(actor_id), "key": idempotency_key, "operation": operation, "request_digest": digest, "created_at": datetime.now(timezone.utc), "response": None})
    return None, False


def reserve_response(actor_id: str, idempotency_key: str, operation: str, response: dict[str, Any]) -> None:
    mongo_db().idempotency_keys.update_one({"actor_id": str(actor_id), "key": idempotency_key, "operation": operation}, {"$set": {"response": response}})
