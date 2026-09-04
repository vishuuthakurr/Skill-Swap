"""Small vendored implementation of ZEGOCLOUD's official Token04 algorithm."""
import base64
import json
import os
import struct
import time
from Crypto.Cipher import AES


def _pad(text: str) -> bytes:
    raw = text.encode("utf-8")
    size = 16 - (len(raw) % 16)
    return raw + bytes([size]) * size


def generate_token04(app_id: int, user_id: str, secret: str, effective_seconds: int, payload: str = "") -> str:
    if not isinstance(app_id, int) or app_id == 0:
        raise ValueError("Zego app id is invalid")
    if not isinstance(user_id, str) or not user_id:
        raise ValueError("Zego user id is invalid")
    if not isinstance(secret, str) or len(secret) != 32:
        raise ValueError("Zego server secret must be a 32-byte string")
    if not isinstance(effective_seconds, int) or effective_seconds <= 0:
        raise ValueError("Zego token expiry is invalid")
    created = int(time.time())
    expires = created + effective_seconds
    plain = json.dumps({"app_id": app_id, "user_id": user_id, "nonce": int.from_bytes(os.urandom(4), "big") & 0x7FFFFFFF, "ctime": created, "expire": expires, "payload": payload}, separators=(",", ":"), ensure_ascii=False)
    iv = "".join("0123456789abcdefghijklmnopqrstuvwxyz"[b % 16] for b in os.urandom(16))
    encrypted = AES.new(secret.encode("utf-8"), AES.MODE_CBC, iv.encode("utf-8")).encrypt(_pad(plain))
    result = bytearray(len(encrypted) + 28)
    result[0:8] = struct.pack("!q", expires)
    result[8:10] = struct.pack("!h", len(iv))
    result[10:26] = iv.encode("utf-8")
    result[26:28] = struct.pack("!h", len(encrypted))
    result[28:] = encrypted
    return "04" + base64.b64encode(result).decode("ascii")
