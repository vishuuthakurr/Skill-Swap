import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { registerSocketRuntime } from "./runtime.mjs";

function socketDouble() {
  const events = new Map();
  return {
    data: {},
    calls: [],
    on(name, handler) { events.set(name, handler); },
    async trigger(name, ...args) { return events.get(name)(...args); },
    join(room) { this.calls.push({ name: "join", room }); },
    leave(room) { this.calls.push({ name: "leave", room }); },
    emit(name, payload) { this.calls.push({ name, payload }); },
    to(room) { return { emit: (name, payload) => this.calls.push({ name, room, payload }) }; },
  };
}

function ioDouble() {
  let middleware;
  let connection;
  return {
    emitted: [],
    use(fn) { middleware = fn; },
    on(name, handler) { if (name === "connection") connection = handler; },
    to(room) { return { emit: (name, payload) => this.emitted.push({ room, name, payload }) }; },
    async connect(socket) {
      const error = await new Promise(resolve => middleware(socket, resolve));
      if (error) return error;
      connection(socket);
      return null;
    },
  };
}

test("authenticated runtime produces Django audit writes for all conversation actions", async () => {
  const io = ioDouble();
  const socket = socketDouble();
  const audits = [];
  const fetchImpl = async (url, init = {}) => {
    if (url.endsWith("/access")) return { ok: true };
    if (url.endsWith("/messages")) return { ok: true, json: async () => ({ id: "m-1", recipient_id: "member-b", body: "hello" }) };
    if (url.endsWith("/audit-events")) { audits.push(JSON.parse(init.body)); return { ok: true }; }
    return { ok: false };
  };
  registerSocketRuntime(io, { jwtSecret: "audit-secret", djangoApi: "https://api.test/api/v1", fetchImpl });
  socket.handshake = { auth: { token: jwt.sign({ sub: "member-a" }, "audit-secret", { expiresIn: "1m" }) }, headers: {} };
  assert.equal(await io.connect(socket), null);
  const joinResult = [];
  await socket.trigger("join_conversation", { conversationId: "c-1" }, value => joinResult.push(value));
  await socket.trigger("send_message", { conversationId: "c-1", body: "hello" }, value => assert.equal(value.ok, true));
  await socket.trigger("message_read", { conversationId: "c-1", messageId: "m-1" });
  await socket.trigger("disconnect");
  assert.equal(joinResult[0].ok, true);
  assert.deepEqual(audits.map(event => event.action), ["conversation_joined", "message_created", "message_read", "socket_disconnected"]);
  assert.ok(audits.every(event => event.source === "socket.io"));
});
