import { CONTACT } from '../../data/contact.js';

export const MAX_MESSAGE = 1200;
export function conversationHistory(messages) {
  const history = messages.filter(m => !m.greeting && !m.failed).map(({ role, text }) => ({ role, text }));
  while (history.length && history.at(-1).role !== 'assistant') history.pop();
  while (history.length > 16 || history.reduce((sum, m) => sum + m.text.length, 0) > 14000) history.splice(0, 2);
  return history;
}

const paths = new Set(['/', '/services', '/pricing', '/portfolio', '/contact', '/about', '/privacy', '/terms', '/refund']);
export function safeChatLink(value) {
  try {
    const url = new URL(value, 'https://www.makeasite.online');
    if (url.username || url.password) return null;
    if (url.origin === 'https://www.makeasite.online' || url.origin === 'https://makeasite.online') {
      return paths.has(url.pathname) ? `${url.pathname}${url.hash}` : null;
    }
    const whatsapp = new URL(CONTACT.whatsapp);
    if (url.origin === whatsapp.origin && url.pathname === whatsapp.pathname) return url.href;
    if (value === `mailto:${CONTACT.email}` || value === `tel:${CONTACT.phone.replace(/\s/g, '')}`) return value;
  } catch { /* Invalid or unsupported links remain plain text. */ }
  return null;
}
