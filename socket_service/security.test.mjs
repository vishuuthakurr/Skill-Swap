import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { conversationRoom, presencePayload, validMessageBody, verifySocketToken } from "./security.mjs";

test("accepts a valid JWT and rejects a missing token", () => {
  const secret = "test-secret";
  const token = jwt.sign({ sub: "member-a" }, secret, { expiresIn: "1m" });
  assert.equal(verifySocketToken(token, secret).sub, "member-a");
  assert.throws(() => verifySocketToken("", secret), /Authentication required/);
});

test("validates conversation rooms and message bounds", () => {
  assert.equal(conversationRoom("conversation-1"), "conversation:conversation-1");
  assert.throws(() => conversationRoom(""), /Invalid conversation/);
  assert.equal(validMessageBody("hello"), true);
  assert.equal(validMessageBody(" "), false);
  assert.equal(validMessageBody("x".repeat(4001)), false);
});

test("normalizes presence payloads without private metadata", () => {
  assert.deepEqual(presencePayload(42, "online"), { userId: "42", status: "online" });
  assert.deepEqual(presencePayload(42, "unknown"), { userId: "42", status: "offline" });
});
