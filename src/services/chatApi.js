import { API_URL } from '../config/api';

export async function sendChatMessage(message, conversationHistory, signal) {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' },
    credentials: 'omit', signal, body: JSON.stringify({ message, conversationHistory })
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = [400, 413, 429].includes(response.status) && typeof data.message === 'string'
      ? data.message.slice(0, 250) : 'I’m having trouble responding right now. Please retry or contact the MakeASite team below.';
    throw new Error(message);
  }
  if (typeof data.reply !== 'string' || !data.reply.trim() || data.reply.length > 3000) throw new Error('The reply could not be loaded. Please retry.');
  return data;
}
