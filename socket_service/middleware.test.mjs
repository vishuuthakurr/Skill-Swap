import assert from "node:assert/strict";
import test from "node:test";
import jwt from "jsonwebtoken";
import { registerAuthMiddleware } from "./middleware.mjs";

function fakeIo() {
  let middleware;
  return { use(fn) { middleware = fn; }, invoke(socket) { return new Promise(resolve => middleware(socket, error => resolve(error || null))); } };
}

test("registered Socket.io middleware gates connection setup", async () => {
  const io = fakeIo();
  const secret = "middleware-secret";
  registerAuthMiddleware(io, secret);
  const validSocket = { handshake: { auth: { token: jwt.sign({ sub: "member-a" }, secret, { expiresIn: "1m" }) }, headers: {} }, data: {} };
  assert.equal(await io.invoke(validSocket), null);
  assert.equal(validSocket.data.user.sub, "member-a");
  const invalidSocket = { handshake: { auth: { token: "invalid" }, headers: {} }, data: {} };
  const error = await io.invoke(invalidSocket);
  assert.match(error.message, /Invalid or expired token/);
  assert.equal(invalidSocket.data.user, undefined);
});
