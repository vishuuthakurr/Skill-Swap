import assert from "node:assert/strict";
import test from "node:test";
import { authorizeConversation, auditEvent, persistConversationMessage, readEvent, typingEvent } from "./conversation.mjs";
import { emitAuditEvent, unreadEvent } from "./audit.mjs";

test("Django-backed conversation authorization accepts only an allowed response", async () => {
  const calls = [];
  const allowed = await authorizeConversation(async (url, init) => { calls.push({ url, init }); return { ok: true }; }, "https://api.test/api/v1", "jwt", "c-1");
  assert.equal(allowed, true);
  assert.match(calls[0].url, /conversations\/c-1\/access$/);
  assert.equal(calls[0].init.headers.Authorization, "Bearer jwt");
  const denied = await authorizeConversation(async () => ({ ok: false }), "https://api.test/api/v1", "jwt", "c-1");
  assert.equal(denied, false);
});

test("message persistence hands off JSON and surfaces provider failures", async () => {
  const result = await persistConversationMessage(async (_url, init) => {
    assert.equal(init.method, "POST");
    assert.deepEqual(JSON.parse(init.body), { body: "hello" });
    return { ok: true, json: async () => ({ id: "m-1", body: "hello" }) };
  }, "https://api.test/api/v1", "jwt", "c-1", "hello");
  assert.equal(result.id, "m-1");
  await assert.rejects(() => persistConversationMessage(async () => ({ ok: false }), "https://api.test/api/v1", "jwt", "c-1", "hello"), /Message persistence failed/);
});

test("typing, read, and audit events carry only authorized routing metadata", () => {
  assert.deepEqual(typingEvent("c-1", 7, true), { event: "typing_start", room: "conversation:c-1", payload: { conversationId: "c-1", userId: "7" } });
  assert.deepEqual(typingEvent("c-1", 7, false), { event: "typing_stop", room: "conversation:c-1", payload: { conversationId: "c-1", userId: "7" } });
  assert.deepEqual(unreadEvent("c-1", "m-1", 7), { conversationId: "c-1", messageId: "m-1", senderId: "7", unread: true });
  assert.deepEqual(readEvent("c-1", "m-1", 7), { event: "message_read", room: "conversation:c-1", payload: { conversationId: "c-1", messageId: "m-1", userId: "7" } });
  assert.deepEqual(auditEvent("message_created", 7, "c-1"), { action: "message_created", actor_id: "7", conversation_id: "c-1", source: "socket.io" });
});

test("audit delivery is best effort and uses the Django boundary", async () => {
  const calls = [];
  await emitAuditEvent(async (url, init) => { calls.push({ url, init }); return { ok: true }; }, "https://api.test/api/v1", "jwt", { action: "joined" });
  assert.match(calls[0].url, /audit-events$/);
  assert.equal(calls[0].init.headers.Authorization, "Bearer jwt");
  await emitAuditEvent(async () => { throw new Error("audit offline"); }, "https://api.test/api/v1", "jwt", { action: "joined" });
});
