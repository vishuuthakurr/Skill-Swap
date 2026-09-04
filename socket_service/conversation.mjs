export async function authorizeConversation(fetchImpl, baseUrl, token, conversationId) {
  const response = await fetchImpl(`${baseUrl}/conversations/${encodeURIComponent(conversationId)}/access`, { headers: { Authorization: `Bearer ${token}` } });
  return response.ok;
}

export async function persistConversationMessage(fetchImpl, baseUrl, token, conversationId, body) {
  const response = await fetchImpl(`${baseUrl}/conversations/${encodeURIComponent(conversationId)}/messages`, {
    method: "POST",
    headers: { "content-type": "application/json", Authorization: `Bearer ${token}` },
    body: JSON.stringify({ body }),
  });
  if (!response.ok) throw new Error("Message persistence failed");
  return response.json();
}

export function typingEvent(conversationId, userId, active) {
  return { event: active ? "typing_start" : "typing_stop", room: `conversation:${conversationId}`, payload: { conversationId, userId: String(userId) } };
}

export function readEvent(conversationId, messageId, userId) {
  return { event: "message_read", room: `conversation:${conversationId}`, payload: { conversationId, messageId, userId: String(userId) } };
}

export function auditEvent(action, actorId, conversationId) {
  return { action, actor_id: String(actorId), conversation_id: String(conversationId), source: "socket.io" };
}
