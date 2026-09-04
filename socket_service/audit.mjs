export async function emitAuditEvent(fetchImpl, baseUrl, token, event) {
  try {
    await fetchImpl(`${baseUrl}/audit-events`, {
      method: "POST",
      headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(event),
    });
  } catch {
    // Conversation delivery must not fail because the audit sink is unavailable.
  }
}

export function auditEvent(action, actorId, conversationId) {
  return { action, actor_id: String(actorId), conversation_id: String(conversationId), source: "socket.io" };
}

export function unreadEvent(conversationId, messageId, senderId) {
  return { conversationId: String(conversationId), messageId: String(messageId), senderId: String(senderId), unread: true };
}
