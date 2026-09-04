import { conversationRoom, presencePayload, validMessageBody } from "./security.mjs";
import { authorizeConversation, persistConversationMessage } from "./conversation.mjs";
import { auditEvent, unreadEvent, emitAuditEvent } from "./audit.mjs";

export function registerConnectionHandlers({ io, socket, userId, jwtToken, djangoApi, fetchImpl = fetch }) {
  socket.join(`user:${userId}`);
  socket.emit("presence_update", presencePayload(userId, "online"));
  const audit = event => emitAuditEvent(fetchImpl, djangoApi, jwtToken, event);
  const allowed = conversationId => authorizeConversation(fetchImpl, djangoApi, jwtToken, conversationId);

  socket.on("join_conversation", async ({ conversationId }, callback = () => undefined) => {
    try {
      if (!conversationId || !(await allowed(conversationId))) return callback({ ok: false, error: "Conversation access denied" });
      socket.join(conversationRoom(conversationId));
      await audit(auditEvent("conversation_joined", userId, conversationId));
      callback({ ok: true });
    } catch { callback({ ok: false, error: "Conversation access could not be verified" }); }
  });
  socket.on("leave_conversation", ({ conversationId }) => { if (conversationId) socket.leave(conversationRoom(conversationId)); });
  socket.on("typing_start", ({ conversationId }) => socket.to(conversationRoom(conversationId)).emit("typing_start", { conversationId, userId }));
  socket.on("typing_stop", ({ conversationId }) => socket.to(conversationRoom(conversationId)).emit("typing_stop", { conversationId, userId }));
  socket.on("send_message", async ({ conversationId, body }, callback = () => undefined) => {
    try {
      if (!conversationId || !validMessageBody(body)) return callback({ ok: false, error: "Message is required" });
      if (!(await allowed(conversationId))) return callback({ ok: false, error: "Conversation access denied" });
      const response = await persistConversationMessage(fetchImpl, djangoApi, jwtToken, conversationId, body.trim());
      io.to(conversationRoom(conversationId)).emit("message_created", response);
      if (response?.recipient_id && response?.id) io.to(`user:${response.recipient_id}`).emit("message_unread", unreadEvent(conversationId, response.id, userId));
      await audit(auditEvent("message_created", userId, conversationId));
      callback({ ok: true, message: response });
    } catch { callback({ ok: false, error: "Message could not be delivered" }); }
  });
  socket.on("message_read", async ({ conversationId, messageId }) => {
    socket.to(conversationRoom(conversationId)).emit("message_read", { conversationId, messageId, userId });
    await audit(auditEvent("message_read", userId, conversationId));
  });
  socket.on("disconnect", async () => {
    io.to(`user:${userId}`).emit("presence_update", presencePayload(userId, "offline"));
    await audit({ action: "socket_disconnected", actor_id: userId, source: "socket.io" });
  });
}
