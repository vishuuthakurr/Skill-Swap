import assert from "node:assert/strict";
import test from "node:test";
import { registerConnectionHandlers } from "./handlers.mjs";
import { authenticateSocket } from "./security.mjs";
import jwt from "jsonwebtoken";

function fakeSocket() {
  const events = new Map();
  const calls = { joined: [], emitted: [], left: [], broadcast: [] };
  return {
    calls,
    on(name, handler) { events.set(name, handler); },
    async trigger(name, ...args) { return events.get(name)(...args); },
    join(room) { calls.joined.push(room); },
    leave(room) { calls.left.push(room); },
    emit(name, payload) { calls.emitted.push({ name, payload }); },
    to(room) { return { emit: (name, payload) => calls.broadcast.push({ room, name, payload }) }; },
  };
}

function fakeIo() {
  const calls = { emitted: [] };
  return { calls, to(room) { return { emit: (name, payload) => calls.emitted.push({ room, name, payload }) }; } };
}

test("Socket.io middleware accepts valid JWTs and rejects invalid ones", () => {
  const secret = "integration-secret";
  const token = jwt.sign({ sub: "member-a" }, secret, { expiresIn: "1m" });
  assert.equal(authenticateSocket({ auth: { token } }, secret).sub, "member-a");
  assert.throws(() => authenticateSocket({ auth: { token: "bad" } }, secret), /Invalid|malformed|jwt/i);
});

test("real connection handlers enforce access and persist authorized messages", async () => {
  const socket = fakeSocket();
  const io = fakeIo();
  const auditCalls = [];
  const fetchImpl = async (url, init = {}) => {
    if (url.endsWith("/access")) return { ok: url.endsWith("c-allowed/access") };
    if (url.endsWith("/messages")) return { ok: true, json: async () => ({ id: "m-1", recipient_id: "member-b", body: JSON.parse(init.body).body }) };
    if (url.endsWith("/audit-events")) { auditCalls.push(JSON.parse(init.body)); return { ok: true }; }
    return { ok: false };
  };
  registerConnectionHandlers({ io, socket, userId: "member-a", jwtToken: "jwt", djangoApi: "https://api.test/api/v1", fetchImpl });
  const denied = [];
  await socket.trigger("join_conversation", { conversationId: "c-denied" }, result => denied.push(result));
  assert.equal(denied[0].ok, false);
  const joined = [];
  await socket.trigger("join_conversation", { conversationId: "c-allowed" }, result => joined.push(result));
  assert.equal(joined[0].ok, true);
  const delivered = [];
  await socket.trigger("send_message", { conversationId: "c-allowed", body: "hello" }, result => delivered.push(result));
  assert.equal(delivered[0].ok, true);
  assert.equal(io.calls.emitted.at(-1).name, "message_unread");
  await socket.trigger("message_read", { conversationId: "c-allowed", messageId: "m-1" });
  await socket.trigger("disconnect");
  assert.deepEqual(auditCalls.map(event => event.action), ["conversation_joined", "message_created", "message_read", "socket_disconnected"]);
});

test("real send_message handler returns a delivery error when Django persistence fails", async () => {
  const socket = fakeSocket();
  const io = fakeIo();
  const fetchImpl = async url => url.endsWith("/access") ? { ok: true } : { ok: false };
  registerConnectionHandlers({ io, socket, userId: "member-a", jwtToken: "jwt", djangoApi: "https://api.test/api/v1", fetchImpl });
  const result = [];
  await socket.trigger("send_message", { conversationId: "c-allowed", body: "hello" }, value => result.push(value));
  assert.deepEqual(result[0], { ok: false, error: "Message could not be delivered" });
});
