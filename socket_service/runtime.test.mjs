import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { registerSocketRuntime } from "./runtime.mjs";

function fakeIo() {
  let middleware;
  let connection;
  return {
    use(fn) { middleware = fn; },
    on(name, fn) { if (name === "connection") connection = fn; },
    async connect(socket) {
      const error = await new Promise(resolve => middleware(socket, resolve));
      if (error) return { error };
      connection(socket);
      return { error: null };
    },
  };
}

test("runtime wires middleware before handler setup", async () => {
  const io = fakeIo();
  const configured = [];
  registerSocketRuntime(io, { jwtSecret: "runtime-secret", djangoApi: "https://api.test/api/v1", registerHandlers: options => configured.push(options) });
  const valid = { handshake: { auth: { token: jwt.sign({ sub: "member-a" }, "runtime-secret", { expiresIn: "1m" }) }, headers: {} }, data: {} };
  assert.equal((await io.connect(valid)).error, null);
  assert.equal(configured.length, 1);
  assert.equal(configured[0].userId, "member-a");
  const invalid = { handshake: { auth: { token: "invalid" }, headers: {} }, data: {} };
  assert.match((await io.connect(invalid)).error.message, /Invalid or expired token/);
  assert.equal(configured.length, 1);
});
