import jwt from "jsonwebtoken";

export function authenticateSocket(handshake, secret) {
  const token = handshake?.auth?.token || handshake?.headers?.authorization?.replace(/^Bearer\\s+/i, "");
  return verifySocketToken(token, secret);
}

export function verifySocketToken(token, secret) {
  if (!token || !secret) throw new Error("Authentication required");
  return jwt.verify(token, secret);
}

export function conversationRoom(conversationId) {
  if (!conversationId || typeof conversationId !== "string" || conversationId.length > 120) throw new Error("Invalid conversation");
  return `conversation:${conversationId}`;
}

export function validMessageBody(body) {
  return typeof body === "string" && body.trim().length > 0 && body.length <= 4000;
}

export function presencePayload(userId, status) {
  return { userId: String(userId), status: status === "online" ? "online" : "offline" };
}
